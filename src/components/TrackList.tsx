import { MusicIcon } from '@/components/Icons'
import { $playTrack, $isPlaying, $playList } from '@/store'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import { type PlayTrack } from '@/store'

type Props = {
	playList: PlayTrack[]
	index: number
}

export default function TrackList({ playList, index }: Props) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [isCurrentSongPlaying, setIsCurrentSongPlaying] = useState(false)

	const { songName: currentSongName } = useStore($playTrack)
	const isSongPlaying = useStore($isPlaying)

	const currentSong = playList[index - 1]

	const isHaveMp3 = !!currentSong.mp3Url

	const isActiveColor = isCurrentSongPlaying ? 'text-orange-500' : ''

	const disabledClass = isHaveMp3
		? 'cursor-pointer text-gray-500 dark:text-gray-300'
		: 'cursor-not-allowed text-gray-300 dark:text-gray-500'

	useEffect(() => {
		setIsPlaying(isSongPlaying && currentSongName === currentSong.songName)
		setIsCurrentSongPlaying(currentSongName === currentSong.songName)
	}, [isSongPlaying, currentSongName, currentSong.songName])

	const handlePlay = () => {
		if (isHaveMp3) {
			$playList.set(playList)
			$playTrack.set(currentSong)
		}
	}

	return (
		<div className={`flex items-center border-b py-2 ${disabledClass}`} onClick={handlePlay}>
			<span className={`mr-2 text-lg ${isActiveColor}`}>{index}.</span>
			{isPlaying && <MusicIcon className={`size-4 ${isActiveColor}`} />}
			<span className={`ml-2 text-lg ${isActiveColor}`}>{currentSong.songName}</span>
		</div>
	)
}
