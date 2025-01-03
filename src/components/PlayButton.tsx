import { Button } from '@/components/ui/button'
import { $playTrack, type PlayTrack } from '@/store'
import { $playList, $isPlaying } from '@/store'
import { useStore } from '@nanostores/react'
import { ListPlus, Play } from 'lucide-react'
interface Props {
	songList: PlayTrack[]
}

export default function PlayButton({ songList }: Props) {
	const playList = useStore($playList)
	const playTrack = useStore($playTrack)
	const handlePlayAll = () => {
		$playList.set(songList)
		$playTrack.set(songList[0])
		$isPlaying.set(true)
	}

	const disabledPlayAll = songList.every((song) => !song.mp3Url)

	const disabledAddToPlayList =
		songList.every((song) => playList.some((item) => item.id === song.id)) ||
		songList.every((song) => !song.mp3Url)

	const handleAddToPlayList = () => {
		// 如果 playList 中已经存在 songList 中的歌曲，则不添加
		const newPlayList = songList.filter((song) => !playList.some((item) => item.id === song.id))
		$playList.set([...playList, ...newPlayList])
		// 如果当前 playTrack 为初始状态，则播放第一首歌曲
		if (!playTrack.id) {
			$playTrack.set(newPlayList[0])
		}
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				className="px-5 py-2 text-sm text-orange-500 md:px-8 md:py-6 md:text-lg"
				onClick={handlePlayAll}
				disabled={disabledPlayAll}
			>
				<Play className="mr-2 size-10" />
				播放全部
			</Button>
			<Button
				variant="secondary"
				className="px-5 py-2 text-sm text-orange-500 md:px-8 md:py-6 md:text-lg"
				onClick={handleAddToPlayList}
				disabled={disabledAddToPlayList}
			>
				<ListPlus className="mr-2 size-10" />
				播放列表
			</Button>
		</div>
	)
}
