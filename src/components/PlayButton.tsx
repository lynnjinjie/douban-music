import { Button } from '@/components/ui/button'
import { $playTrack, type PlayTrack } from '@/store'
import { $playList } from '@/store'
interface Props {
	playList: PlayTrack[]
}

export default function PlayButton({ playList }: Props) {
	const handlePlayAll = () => {
		$playList.set(playList)
		$playTrack.set(playList[0])
	}

	return (
		<Button variant="outline" className="px-8 py-6 text-lg text-orange-500" onClick={handlePlayAll}>
			播放全部
		</Button>
	)
}
