import { useState, useEffect } from 'react'
import { $playTrack, $isPlaying, $playList } from '@/store'
import { useStore } from '@nanostores/react'
import { type PlayTrack } from '@/store'
import { AudioLines, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FillPauseIcon, FillPlayIcon } from '@/components/Icons'

type Props = {
	songList: PlayTrack[]
}

export default function TrackList({ songList }: Props) {
	const [hightlightSongId, setHightlightSongId] = useState('')
	const { id: playTrackId } = useStore($playTrack)
	const isPlaying = useStore($isPlaying)
	const playList = useStore($playList)

	const isActiveColor = (id: string) => {
		return playTrackId === id && 'text-orange-500'
	}
	const isCurrentSongInPlayList = (id: string) => {
		return playList.some((item) => item.id === id)
	}

	const disabledClass = (id: string) => {
		return isHaveMp3(id)
			? 'cursor-pointer text-gray-500 dark:text-gray-300'
			: 'cursor-not-allowed text-gray-300 dark:text-gray-500'
	}

	useEffect(() => {
		setHightlightSongId(playTrackId)
	}, [playTrackId])

	const handlePlay = (id: string) => {
		if (!isHaveMp3(id)) return
		// 如果当前歌曲是正在播放的歌曲，则暂停
		if (playTrackId === id) {
			$isPlaying.set(!isPlaying)
			return
		}
		// 如果当前歌曲不存在，将当前歌曲添加到播放列表的顶部
		if (!isCurrentSongInPlayList(id)) {
			const newPlayList = [findSong(id)!, ...playList]
			$playList.set(newPlayList)
			$playTrack.set(findSong(id)!)
			$isPlaying.set(true)
			return
		}
		$playTrack.set(findSong(id)!)
		$isPlaying.set(true)
	}

	const handleAddToPlayList = (id: string) => {
		if (!isHaveMp3(id)) return
		const newPlayList = [...playList, findSong(id)!]
		$playList.set(newPlayList)
	}

	const findSong = (id: string) => {
		return songList.find((item) => item.id === id)
	}

	const isHaveMp3 = (id: string) => {
		return findSong(id)?.mp3Url
	}

	return (
		<div className="flex flex-col">
			{songList.map(({ id, songName, duration }, index) => (
				<div
					key={id}
					data-track-id={id}
					className={cn(
						'group flex items-center justify-between rounded-md px-2 py-2 transition-opacity hover:bg-orange-500/10 hover:duration-1000',
						hightlightSongId === id && 'bg-orange-500/10',
						disabledClass(id)
					)}
					onClick={() => setHightlightSongId(id)}
				>
					<div className="flex items-center">
						<div
							className={`relative inline-flex size-10 items-center justify-center ${isActiveColor(id)}`}
							onClick={() => handlePlay(id)}
						>
							{isPlaying && playTrackId === id ? (
								<AudioLines className={`size-6 group-hover:opacity-0 ${isActiveColor(id)}`} />
							) : (
								<span className={cn('group-hover:opacity-0', playTrackId === id && 'opacity-0')}>
									{index + 1}
								</span>
							)}
							<span
								className={cn(
									'absolute inset-0 flex items-center justify-center rounded-md opacity-0',
									playTrackId === id && !isPlaying && 'opacity-100',
									'group-hover:opacity-100'
								)}
							>
								{isPlaying && playTrackId === id ? (
									<FillPauseIcon className={cn('size-6', isActiveColor(id))} />
								) : (
									<FillPlayIcon className={cn('size-6', isActiveColor(id))} />
								)}
							</span>
						</div>
						<span className={`ml-2 line-clamp-1 text-base md:text-lg ${isActiveColor(id)}`}>
							{songName}
						</span>
					</div>
					<span
						className={`relative me-3.5 inline-flex items-center justify-center text-lg ${isActiveColor(id)}`}
					>
						<span className="group-hover:opacity-0">{duration}</span>
						<span className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100">
							{isCurrentSongInPlayList(id) ? (
								<Check className="size-6" />
							) : (
								<Plus className="size-6" onClick={() => handleAddToPlayList(id)} />
							)}
						</span>
					</span>
				</div>
			))}
		</div>
	)
}
