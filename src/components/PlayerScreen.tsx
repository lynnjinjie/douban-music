import PlayList from '@/components/PlayList'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer'
import { ListMusic, ChevronDown, SkipBack, SkipForward } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { $playTrack, $isPlaying, $playList } from '@/store'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Slider } from '@/components/ui/slider'
import { FillPauseIcon, FillPlayIcon } from '@/components/Icons'

interface Props {
	open: boolean
	progress: number
	sliderValue: number
	currentTime: string
	index: number
	onOpenChange: (open: boolean) => void
	playPrev: () => void
	playNext: () => void
	handleProgressChange: (value: number[]) => void
	handleProgressPointerUp: () => void
}

export default function PlayerScreen({
	open,
	onOpenChange,
	playPrev,
	playNext,
	progress,
	sliderValue,
	handleProgressChange,
	handleProgressPointerUp,
	currentTime,
	index
}: Props) {
	const { songName, songArtist, songImgHref, id: songId, duration } = useStore($playTrack)
	const playList = useStore($playList)
	const isPlaying = useStore($isPlaying)

	const handlePlay = () => {
		$isPlaying.set(!isPlaying)
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="h-full">
				<VisuallyHidden>
					<DrawerTitle className="text-2xl font-bold">music player</DrawerTitle>
					<DrawerDescription>music player</DrawerDescription>
				</VisuallyHidden>
				<div className="flex h-screen flex-col overflow-y-hidden">
					<div className="mt-2 flex items-center justify-between px-4 py-2">
						<ChevronDown className="size-8" onClick={() => onOpenChange(false)} />
					</div>
					<div className="flex flex-1 flex-col items-center justify-between gap-4 px-6 py-4">
						<div className="flex flex-col items-center justify-between gap-5">
							<div className="flex w-full justify-center">
								<img
									src={songImgHref}
									alt={songName}
									className="aspect-square w-[80%] rounded-md"
									style={{ viewTransitionName: `song-cover` }}
								/>
							</div>
							<div className="flex flex-col items-center justify-center gap-5">
								<div className="text-center text-2xl font-bold">{songName}</div>
								<div className="text-center text-lg">{songArtist}</div>
							</div>
						</div>
						<div className="flex w-full flex-col items-center justify-center gap-4">
							<div className="my-6 h-1.5 w-full bg-gray-200">
								<Slider
									defaultValue={[progress]}
									value={[sliderValue]}
									onValueChange={handleProgressChange}
									onPointerUp={handleProgressPointerUp}
									className="w-full cursor-pointer"
								/>
								<div className="mt-2 flex w-full items-center justify-between text-sm text-gray-500">
									<span className="mr-2">{currentTime}</span>
									<span className="ml-2">{duration}</span>
								</div>
							</div>
							<div className="flex items-center gap-6">
								<button onClick={playPrev} disabled={index === 0}>
									<SkipBack className="size-12" />
								</button>
								<button onClick={handlePlay}>
									{isPlaying ? (
										<FillPauseIcon className="size-24" />
									) : (
										<FillPlayIcon className="size-24" />
									)}
								</button>
								<button onClick={playNext} disabled={index === playList.length}>
									<SkipForward className="size-12" />
								</button>
							</div>
						</div>
					</div>
					<div className="mb-6 flex justify-center">
						<PlayList>
							<Button variant="outline" className="w-32">
								<ListMusic className="size-6" />
								<span className="ml-2">播放列表</span>
							</Button>
						</PlayList>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
