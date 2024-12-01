import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { playTrack, isPlaying as isPlayingStore } from '@/store'
import { PlayIcon, PauseIcon } from '@/components/Icons'

export default function Player() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [progress, setProgress] = useState(0)
	const { songName, songArtist, songImgHref, mp3Url } = useStore(playTrack)
	const isPlaying = useStore(isPlayingStore)

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
			isPlayingStore.set(false)
			setProgress(0)
		}
	}, [progress])

	const handlePlay = () => {
		isPlayingStore.set(!isPlaying)
	}

	return (
		<div
			className={`z-2 fixed bottom-0 left-0 right-0 bg-gray-100 ${isShow ? 'block' : 'hidden'}`}
			style={{ viewTransitionName: 'player' }}
		>
			<div className="h-1.5 bg-gray-200">
				<div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
			</div>
			<div className="container mx-auto flex max-w-screen-lg items-center justify-between gap-5 px-3 py-2 sm:px-6 sm:py-4">
				<img src={songImgHref} alt={songName} width={60} height={60} className="block rounded-md" />
				<div className="min-w-0 flex-1">
					<div className="text-xl">{songName}</div>
					<div className="text-sm">{songArtist}</div>
				</div>
				<audio ref={audioRef} src={mp3Url}></audio>
				<div className="flex items-center gap-6">
					{/* <button>上一首</button> */}
					<button onClick={handlePlay}>
						{isPlaying ? (
							<PauseIcon className="h-10 w-10 sm:h-14 sm:w-14" />
						) : (
							<PlayIcon className="h-10 w-10 sm:h-14 sm:w-14" />
						)}
					</button>
					{/* <button>下一首</button> */}
				</div>
			</div>
		</div>
	)
}
