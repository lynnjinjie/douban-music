import { Button } from '@/components/ui/button'
import { $playTrack, type PlayTrack } from '@/store'
import { $playList } from '@/store'
import { useStore } from '@nanostores/react'
import { ListPlus, Play } from 'lucide-react'
interface Props {
	songList: PlayTrack[]
}

export default function PlayButton({ songList }: Props) {
	const playList = useStore($playList)

	const handlePlayAll = () => {
		$playList.set(songList)
		$playTrack.set(songList[0])
	}

	const disabledAddToPlayList = songList.every((song) =>
		playList.some((item) => item.id === song.id)
	)

	const handleAddToPlayList = () => {
		// 如果 playList 中已经存在 songList 中的歌曲，则不添加
		const newPlayList = songList.filter((song) => !playList.some((item) => item.id === song.id))
		$playList.set([...newPlayList, ...playList])
		$playTrack.set(songList[0])
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				className="px-8 py-6 text-lg text-orange-500"
				onClick={handlePlayAll}
			>
				<Play className="mr-2 size-10" />
				播放全部
			</Button>
			<Button
				variant="secondary"
				className="px-8 py-6 text-lg text-orange-500"
				onClick={handleAddToPlayList}
				disabled={disabledAddToPlayList}
			>
				<ListPlus className="mr-2 size-10" />
				播放列表
			</Button>
		</div>
	)
}
