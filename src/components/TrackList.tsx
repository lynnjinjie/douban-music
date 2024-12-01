import { MusicIcon } from '@/components/Icons'
import { playTrack, isPlaying as isPlayingStore } from '@/store'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

type Props = {
	index: number
	songName: string
	songArtist: string
	songImgHref: string
	mp3Url: string
}

export default function TrackList({ index, songName, songArtist, songImgHref, mp3Url }: Props) {
	const { songName: currentSongName, songArtist: currentSongArtist } = useStore(playTrack)

	const isPlaying = useStore(isPlayingStore)

	const [isCurrentSongPlaying, setIsCurrentSongPlaying] = useState(false)

	const isHaveMp3 = !!mp3Url

	const isActiveColor = isCurrentSongPlaying ? 'text-blue-500' : ''

	const disabledClass = isHaveMp3
		? 'cursor-pointer text-gray-500'
		: 'cursor-not-allowed text-gray-300'

	useEffect(() => {
		setIsCurrentSongPlaying(isPlaying && currentSongName === songName)
	}, [isPlaying, currentSongName, songName])

	const handlePlay = () => {
		if (isHaveMp3) {
			playTrack.set({ index, songName, songArtist, songImgHref, mp3Url })
		}
	}

	return (
		<div
			className={`flex cursor-pointer items-center border-b py-2 ${disabledClass}`}
			onClick={handlePlay}
		>
			<span className={`mr-2 text-lg ${isActiveColor}`}>{index}.</span>
			{isCurrentSongPlaying && <MusicIcon className={`size-4 ${isActiveColor}`} />}
			<span className={`ml-2 text-lg ${isActiveColor}`}>{songName}</span>
		</div>
	)
}
