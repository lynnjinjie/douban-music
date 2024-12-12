import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { playTrack, isPlaying as isPlayingStore, $playList } from '@/store'
import { PlayIcon, PauseIcon } from '@/components/Icons'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { SkipBack, SkipForward } from 'lucide-react'

export default function Player() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [progress, setProgress] = useState(0)
	const { songName, songArtist, songImgHref, mp3Url, albumId, index } = useStore(playTrack)
	const isPlaying = useStore(isPlayingStore)
	const playList = useStore($playList)

	const isShow = !!songName && !!songArtist && !!songImgHref && !!mp3Url

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
			}
		})
	}, [])

	useEffect(() => {
		if (mp3Url && audioRef.current) {
			// audioRef.current.load()
			audioRef.current.currentTime = 0
			isPlayingStore.set(true)
			audioRef.current.play()
			setProgress(0)
		}
	}, [mp3Url])

	useEffect(() => {
		if (progress >= 99.99) {
			const nextIndex = index + 1
			if (nextIndex < playList.length) {
				playTrack.set(playList[nextIndex - 1])
				// 播放下一首
				isPlayingStore.set(true)
			} else {
				isPlayingStore.set(false)
			}
		}
	}, [progress, index, playList])

	const handlePlay = () => {
		isPlayingStore.set(!isPlaying)
	}

	const handleProgressChange = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = (value[0] * audioRef.current.duration) / 100
		}
	}

	const handlePrev = () => {
		const prevIndex = index - 1
		if (prevIndex > 0) {
			playTrack.set(playList[prevIndex - 1])
			isPlayingStore.set(true)
		} else {
			isPlayingStore.set(false)
		}
	}

	const handleNext = () => {
		const nextIndex = index + 1
		if (nextIndex <= playList.length) {
			playTrack.set(playList[nextIndex - 1])
			isPlayingStore.set(true)
		} else {
			isPlayingStore.set(false)
		}
	}

	return (
		<div
			className={`z-2 fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-zinc-700 ${isShow ? 'block' : 'hidden'}`}
			style={{ viewTransitionName: 'player' }}
		>
			<div className="h-1.5 bg-gray-200">
				<Slider
					value={[progress]}
					onValueChange={handleProgressChange}
					className="w-full rounded-none"
				/>
			</div>
			<div className="container mx-auto flex max-w-screen-lg items-center justify-between gap-5 px-3 py-2 sm:px-6 sm:py-4">
				<a href={`/album/${albumId}`}>
					<img
						src={songImgHref}
						alt={songName}
						width={60}
						height={60}
						decoding="async"
						loading="lazy"
						className="block rounded-md"
					/>
				</a>
				<div className="min-w-0 flex-1">
					<div className="text-xl dark:text-white">{songName}</div>
					<div className="text-sm dark:text-white">{songArtist}</div>
				</div>
				<audio ref={audioRef} src={mp3Url}></audio>
				<div className="flex items-center gap-6">
					<Button
						variant="outline"
						size="icon"
						className="text-orange-500"
						onClick={handlePrev}
						disabled={index === 1}
					>
						<SkipBack className="size-6" />
					</Button>
					<button onClick={handlePlay}>
						{isPlaying ? (
							<PauseIcon className="h-10 w-10 sm:h-14 sm:w-14 dark:text-white" />
						) : (
							<PlayIcon className="h-10 w-10 sm:h-14 sm:w-14 dark:text-white" />
						)}
					</button>
					<Button
						variant="outline"
						size="icon"
						className="text-orange-500"
						onClick={handleNext}
						disabled={index === playList.length}
					>
						<SkipForward className="size-6" />
					</Button>
				</div>
			</div>
		</div>
	)
}
