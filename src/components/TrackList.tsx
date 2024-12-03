import { MusicIcon } from '@/components/Icons'
import { playTrack, isPlaying as isPlayingStore } from '@/store'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

type Props = {
	albumId: string
	index: number
	songName: string
	songArtist: string
	songImgHref: string
	mp3Url: string
}

export default function TrackList({
	albumId,
	index,
	songName,
	songArtist,
	songImgHref,
	mp3Url
}: Props) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [isCurrentSongPlaying, setIsCurrentSongPlaying] = useState(false)

	const { songName: currentSongName } = useStore(playTrack)
	const isSongPlaying = useStore(isPlayingStore)

	const isHaveMp3 = !!mp3Url

	const isActiveColor = isCurrentSongPlaying ? 'text-blue-500' : ''

	const disabledClass = isHaveMp3
		? 'cursor-pointer text-gray-500 dark:text-gray-300'
		: 'cursor-not-allowed text-gray-300 dark:text-gray-500'

	useEffect(() => {
		setIsPlaying(isSongPlaying && currentSongName === songName)
		setIsCurrentSongPlaying(currentSongName === songName)
	}, [isSongPlaying, currentSongName, songName])

	const handlePlay = () => {
		if (isHaveMp3) {
			playTrack.set({ albumId, index, songName, songArtist, songImgHref, mp3Url })
		}
	}

	return (
		<div className={`flex items-center border-b py-2 ${disabledClass}`} onClick={handlePlay}>
			<span className={`mr-2 text-lg ${isActiveColor}`}>{index}.</span>
			{isPlaying && <MusicIcon className={`size-4 ${isActiveColor}`} />}
			<span className={`ml-2 text-lg ${isActiveColor}`}>{songName}</span>
		</div>
	)
}
