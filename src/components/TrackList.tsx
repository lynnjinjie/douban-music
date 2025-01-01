import { $playTrack, $isPlaying, $playList } from '@/store'
import { useStore } from '@nanostores/react'
import { type PlayTrack } from '@/store'
import { AudioLines, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FillPauseIcon, FillPlayIcon } from '@/components/Icons'

type Props = {
	songList: PlayTrack[]
	id: string
	index: number
}

export default function TrackList({ songList, id, index }: Props) {
	const { id: playTrackId } = useStore($playTrack)
	const isPlaying = useStore($isPlaying)
	const playList = useStore($playList)
	const currentSong = songList[index]

	const isHaveMp3 = !!currentSong?.mp3Url

	const isCurrentSongTrack = playTrackId === id

	const isActiveColor = isCurrentSongTrack && 'text-orange-500'
	const isCurrentSongInPlayList = playList.some((item) => item.id === currentSong.id)

	const disabledClass = isHaveMp3
		? 'cursor-pointer text-gray-500 dark:text-gray-300'
		: 'cursor-not-allowed text-gray-300 dark:text-gray-500'

	const handlePlay = () => {
		if (isHaveMp3) {
			// 如果当前歌曲是正在播放的歌曲，则暂停
			if (isCurrentSongTrack) {
				$isPlaying.set(!isPlaying)
				return
			}
			// 如果当前歌曲不存在，将当前歌曲添加到播放列表的顶部
			if (!isCurrentSongInPlayList) {
				const newPlayList = [currentSong, ...playList]
				$playList.set(newPlayList)
				$playTrack.set(currentSong)
				$isPlaying.set(true)
				return
			}
			$playTrack.set(currentSong)
			$isPlaying.set(true)
		}
	}

	const handleAddToPlayList = () => {
		const newPlayList = [...playList, currentSong]
		$playList.set(newPlayList)
	}

	return (
		<div
			className={cn(
				'group flex items-center justify-between px-2 py-2 transition-opacity hover:bg-orange-500/10 hover:duration-1000',
				isCurrentSongTrack && 'bg-orange-500/10',
				disabledClass
			)}
		>
			<div className="flex items-center">
				<div
					className={`relative inline-flex size-10 items-center justify-center ${isActiveColor}`}
					onClick={handlePlay}
				>
					{isPlaying && isCurrentSongTrack ? (
						<AudioLines className={`size-6 group-hover:opacity-0 ${isActiveColor}`} />
					) : (
						<span className="group-hover:opacity-0">{index + 1}</span>
					)}
					<span
						className={cn(
							'absolute inset-0 flex items-center justify-center rounded-md opacity-0',
							'group-hover:opacity-100'
						)}
					>
						{isPlaying && isCurrentSongTrack ? (
							<FillPauseIcon className={cn('size-6', isActiveColor)} />
						) : (
							<FillPlayIcon className={cn('size-6', isActiveColor)} />
						)}
					</span>
				</div>
				<span className={`ml-2 line-clamp-1 text-base md:text-lg ${isActiveColor}`}>
					{currentSong?.songName}
				</span>
			</div>
			<span
				className={`relative inline-flex w-12 items-center justify-center text-lg ${isActiveColor}`}
			>
				<span className="group-hover:opacity-0">{currentSong?.duration}</span>
				<span className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100">
					{isCurrentSongInPlayList ? (
						<Check className="size-6" />
					) : (
						<Plus className="size-6" onClick={handleAddToPlayList} />
					)}
				</span>
			</span>
		</div>
	)
}
