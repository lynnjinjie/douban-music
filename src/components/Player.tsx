import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import {
	$playTrack,
	$isPlaying,
	$playList,
	$isInit,
	handleNextTrack,
	handlePrevTrack
} from '@/store'
import { ListMusicIcon, MusicIcon } from '@/components/Icons'
import { Slider } from '@/components/ui/slider'
import { CirclePause, CirclePlay, SkipBack, SkipForward } from 'lucide-react'
import PlayerScreen from '@/components/PlayerScreen'
import useMediaQuery from '@/hooks/useMediaQuery'
import PlayList from '@/components/PlayList'
import { formatDurationToSeconds, formatSecondsToMinutes } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
export default function Player() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [progress, setProgress] = useState(0)
	const [sliderValue, setSliderValue] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const [isOpenPlayerScreen, setIsOpenPlayerScreen] = useState(false)
	const [currentTime, setCurrentTime] = useState('00:00')

	const {
		songName,
		songArtist,
		songImgHref,
		mp3Url,
		albumId,
		id: songId,
		duration
	} = useStore($playTrack)
	const isPlaying = useStore($isPlaying)
	const playList = useStore($playList)
	const isInit = useStore($isInit)
	const index = playList.findIndex((item) => item.id === songId)

	const isShow = !!songName && !!songArtist && !!songImgHref && !!mp3Url
	const isMobile = useMediaQuery('(max-width: 768px)')

	const draggingTime = formatSecondsToMinutes(
		(sliderValue * (audioRef.current?.duration || 0)) / 100
	)

	useEffect(() => {
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
		if (mp3Url && audioRef.current && !isInit) {
			resetPlayer()
		}
	}, [mp3Url, isInit])
	const resetPlayer = () => {
		if (audioRef.current) {
			setProgress(0)
			setSliderValue(0)
			audioRef.current.currentTime = 0
			audioRef.current.play()
			$isPlaying.set(true)
		}
	}

	useEffect(() => {
		if (Number(progress.toFixed(2)) >= 99.99) {
			handleNextTrack()
			$isPlaying.set(true)
		}
		if (!isDragging) {
			setSliderValue(progress)
		}
	}, [progress, isDragging])

	const handlePlay = () => {
		if ($isInit) {
			$isInit.set(false)
		}
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
		if ($isInit) {
			$isInit.set(false)
		}
		$isPlaying.set(true)
	}

	const handleAudioPause = () => {
		$isPlaying.set(false)
	}

	const handlePrev = () => {
		handlePrevTrack()
		$isPlaying.set(true)
	}

	const handleNext = () => {
		handleNextTrack()
		$isPlaying.set(true)
	}

	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 right-0 h-20 bg-gray-50 dark:bg-zinc-700',
				isMobile ? 'z-0' : 'z-[52]',
				isShow ? 'block' : 'hidden'
			)}
			style={{ viewTransitionName: 'player' }}
		>
			{!isMobile ? (
				<div className="h-1 bg-gray-200">
					<Slider
						defaultValue={[progress]}
						value={[sliderValue]}
						step={0.01}
						onValueChange={handleProgressChange}
						onPointerUp={handleProgressPointerUp}
						className="h-full cursor-pointer rounded-none"
					/>
				</div>
			) : (
				<div className="h-0.5 bg-gray-200">
					<Progress value={progress} className="size-full cursor-pointer rounded-none" />
				</div>
			)}
			<div className="container mx-auto flex h-full max-w-screen-lg items-center justify-between gap-5 px-3 py-2 sm:px-6 sm:py-4">
				{isMobile ? (
					<img
						src={songImgHref}
						alt={songName}
						width={50}
						height={50}
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
				<div className="min-w-0 flex-1 space-y-1">
					<div className="line-clamp-1 text-base dark:text-white md:text-xl">{songName}</div>
					<div className="line-clamp-1 text-sm dark:text-white md:text-base">{songArtist}</div>
				</div>
				{!isMobile && (
					<div className="text-sm dark:text-white">
						{isDragging ? draggingTime : currentTime} / {duration}
					</div>
				)}
				<audio
					ref={audioRef}
					src={mp3Url}
					onPlay={handleAudioPlay}
					onPause={handleAudioPause}
				></audio>
				<div className="flex items-center gap-6">
					{!isMobile && (
						<button onClick={handlePrev}>
							<SkipBack className="size-6" />
						</button>
					)}
					<button onClick={handlePlay}>
						{isPlaying ? (
							<CirclePause className="size-12 sm:size-14" />
						) : (
							<CirclePlay className="size-12 sm:size-14" />
						)}
					</button>
					{!isMobile && (
						<button onClick={handleNext}>
							<SkipForward className="size-6" />
						</button>
					)}
					<PlayList>
						<button>
							<ListMusicIcon className="size-6" />
						</button>
					</PlayList>
				</div>
			</div>
			<PlayerScreen
				open={isOpenPlayerScreen}
				progress={progress}
				sliderValue={sliderValue}
				currentTime={currentTime}
				draggingTime={draggingTime}
				isDragging={isDragging}
				index={index}
				onOpenChange={setIsOpenPlayerScreen}
				playPrev={handlePrev}
				playNext={handleNext}
				handleProgressChange={handleProgressChange}
				handleProgressPointerUp={handleProgressPointerUp}
			/>
		</div>
	)
}
