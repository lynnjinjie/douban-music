import { MusicIcon } from '@/components/Icons'
import { $playTrack, $isPlaying, $playList } from '@/store'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import { type PlayTrack } from '@/store'

type Props = {
	songList: PlayTrack[]
	id: string
	index: number
}

export default function TrackList({ songList, id, index }: Props) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [isCurrentSongPlaying, setIsCurrentSongPlaying] = useState(false)

	const { songName: currentSongName } = useStore($playTrack)
	const isSongPlaying = useStore($isPlaying)
	const playList = useStore($playList)
	const currentSong = songList[index]

	const isHaveMp3 = !!currentSong?.mp3Url

	const isActiveColor = isCurrentSongPlaying ? 'text-orange-500' : ''

	const disabledClass = isHaveMp3
		? 'cursor-pointer text-gray-500 dark:text-gray-300'
		: 'cursor-not-allowed text-gray-300 dark:text-gray-500'

	useEffect(() => {
		setIsPlaying(isSongPlaying && currentSongName === currentSong?.songName)
		setIsCurrentSongPlaying(currentSongName === currentSong?.songName)
	}, [isSongPlaying, currentSongName, currentSong?.songName])

	const handlePlay = () => {
		if (isHaveMp3) {
			// 如果当前歌曲不存在，将当前歌曲添加到播放列表的顶部
			const isCurrentSongInPlayList = playList.some((item) => item.id === currentSong.id)
			if (!isCurrentSongInPlayList) {
				const newPlayList = [currentSong, ...playList]
				$playList.set(newPlayList)
			}
			$playTrack.set(currentSong)
		}
	}

	return (
		<div
			className={`flex items-center justify-between border-b py-2 ${disabledClass}`}
			onClick={handlePlay}
		>
			<div className="flex items-center">
				<span className={`mr-2 text-lg ${isActiveColor}`}>{index + 1}.</span>
				{isPlaying && <MusicIcon className={`size-4 ${isActiveColor}`} />}
				<span className={`ml-2 text-lg ${isActiveColor}`}>{currentSong?.songName}</span>
			</div>
			<span className={`ml-2 text-lg ${isActiveColor}`}>{currentSong?.duration}</span>
		</div>
	)
}
