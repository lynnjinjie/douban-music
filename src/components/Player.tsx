import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { $playTrack, $isPlaying, $playList } from '@/store'
import { ListMusicIcon } from '@/components/Icons'
import { Slider } from '@/components/ui/slider'
import { CirclePause, CirclePlay, SkipBack, SkipForward } from 'lucide-react'
import PlayerScreen from '@/components/PlayerScreen'
import useMediaQuery from '@/hooks/useMediaQuery'
import PlayList from '@/components/PlayList'
import { formatSecondsToMinutes } from '@/lib/utils'

export default function Player() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [progress, setProgress] = useState(0)
	const [sliderValue, setSliderValue] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const [isOpenPlayerScreen, setIsOpenPlayerScreen] = useState(false)
	const [currentTime, setCurrentTime] = useState('00:00')

	const { songName, songArtist, songImgHref, mp3Url, albumId, index, duration } =
		useStore($playTrack)
	const isPlaying = useStore($isPlaying)
	const playList = useStore($playList)

	const isShow = !!songName && !!songArtist && !!songImgHref && !!mp3Url

	const isMobile = useMediaQuery('(max-width: 768px)')

	useEffect(() => {
		console.log('isPlaying', isPlaying)
		if (isPlaying) {
			audioRef.current?.play()
		} else {
			audioRef.current?.pause()
		}
	}, [isPlaying])

	useEffect(() => {
		audioRef.current?.addEventListener('timeupdate', () => {
			if (audioRef.current?.duration) {
				const progress = (audioRef.current?.currentTime * 100) / (audioRef.current?.duration || 0)
				setProgress(progress)
				setCurrentTime(formatSecondsToMinutes(audioRef.current?.currentTime))
			}
		})
	}, [])

	// 设置音频封面，标题，艺术家等元数据
	useEffect(() => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: songName,
				artist: songArtist,
				album: albumId,
				artwork: [{ src: songImgHref }]
			})
		}
	}, [songName, songArtist, albumId, songImgHref])

	useEffect(() => {
		if (mp3Url && audioRef.current) {
			setProgress(0)
			setSliderValue(0)
			audioRef.current.currentTime = 0
			audioRef.current.play()
			$isPlaying.set(true)
		}
	}, [mp3Url])

	useEffect(() => {
		if (Number(progress.toFixed(2)) >= 99.99) {
			const nextIndex = index + 1
			if (nextIndex <= playList.length) {
				$playTrack.set(playList[nextIndex - 1])
			} else {
				$isPlaying.set(false)
			}
		}
		if (!isDragging) {
			setSliderValue(progress)
		}
	}, [progress, isDragging])

	const handlePlay = () => {
		$isPlaying.set(!isPlaying)
	}

	const handleProgressChange = (value: number[]) => {
		setIsDragging(true)
		setSliderValue(value[0])
	}

	const handleProgressPointerUp = () => {
		if (audioRef.current) {
			audioRef.current.currentTime = (sliderValue * audioRef.current.duration) / 100
			setProgress(sliderValue)
		}
		setIsDragging(false)
	}

	const handleAudioPlay = () => {
		$isPlaying.set(true)
	}

	const handleAudioPause = () => {
		$isPlaying.set(false)
	}

	const handlePrev = () => {
		const prevIndex = index - 1
		if (prevIndex > 0) {
			$playTrack.set(playList[prevIndex - 1])
			$isPlaying.set(true)
		} else {
			$isPlaying.set(false)
		}
	}

	const handleNext = () => {
		const nextIndex = index + 1
		if (nextIndex <= playList.length) {
			$playTrack.set(playList[nextIndex - 1])
			$isPlaying.set(true)
		} else {
			$isPlaying.set(false)
		}
	}

	return (
		<div
			className={`h-25 fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-zinc-700 ${isMobile ? 'z-0' : 'z-[52]'} ${isShow ? 'block' : 'hidden'}`}
			style={{ viewTransitionName: 'player' }}
		>
			<div className="h-1.5 bg-gray-200">
				<Slider
					defaultValue={[progress]}
					value={[sliderValue]}
					onValueChange={handleProgressChange}
					onPointerUp={handleProgressPointerUp}
					className="w-full cursor-pointer rounded-none"
				/>
			</div>
			<div className="container mx-auto flex max-w-screen-lg items-center justify-between gap-5 px-3 py-2 sm:px-6 sm:py-4">
				{isMobile ? (
					<img
						src={songImgHref}
						alt={songName}
						width={60}
						height={60}
						decoding="async"
						loading="lazy"
						className="block rounded-md"
						onClick={() => setIsOpenPlayerScreen(true)}
					/>
				) : (
					<a href={`/album/${albumId}`}>
						<img
							src={songImgHref}
							alt={songName}
							width={60}
							height={60}
							decoding="async"
							loading="lazy"
							className="block rounded-md"
							style={{ viewTransitionName: `song-cover` }}
						/>
					</a>
				)}
				<div className="min-w-0 flex-1">
					<div className="text-xl dark:text-white">{songName}</div>
					<div className="text-sm dark:text-white">{songArtist}</div>
				</div>
				<div className="text-sm dark:text-white">
					{currentTime} / {duration}
				</div>
				<audio
					ref={audioRef}
					src={mp3Url}
					onPlay={handleAudioPlay}
					onPause={handleAudioPause}
				></audio>
				<div className="flex items-center gap-6">
					<button onClick={handlePrev} disabled={index === 1}>
						<SkipBack className="size-6" />
					</button>
					<button onClick={handlePlay}>
						{isPlaying ? (
							<CirclePause className="size-12 sm:size-14" />
						) : (
							<CirclePlay className="size-12 sm:size-14" />
						)}
					</button>
					<button onClick={handleNext} disabled={index === playList.length}>
						<SkipForward className="size-6" />
					</button>
					{!isMobile && (
						<PlayList>
							<button className="text-gray-500 dark:text-gray-300">
								<ListMusicIcon className="size-6" />
							</button>
						</PlayList>
					)}
				</div>
			</div>
			<PlayerScreen
				open={isOpenPlayerScreen}
				onOpenChange={setIsOpenPlayerScreen}
				playPrev={handlePrev}
				playNext={handleNext}
				progress={progress}
				sliderValue={sliderValue}
				handleProgressChange={handleProgressChange}
				handleProgressPointerUp={handleProgressPointerUp}
			/>
		</div>
	)
}
