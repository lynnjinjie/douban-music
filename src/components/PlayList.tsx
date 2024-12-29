import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
	DrawerTrigger,
	DrawerPortal
} from '@/components/ui/drawer'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { $playList, $playTrack, type PlayTrack } from '@/store'
import useMediaQuery from '@/hooks/useMediaQuery'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function PlayList({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const playList = useStore($playList)

	const isMobile = useMediaQuery('(max-width: 768px)')

	const { id: playTrackId } = useStore($playTrack)

	return (
		<>
			{isMobile ? (
				<PlayListMobile
					open={open}
					setOpen={setOpen}
					playList={playList}
					children={children}
					playTrackId={playTrackId}
				/>
			) : (
				<PlayListDesktop
					open={open}
					setOpen={setOpen}
					playList={playList}
					children={children}
					playTrackId={playTrackId}
				/>
			)}
		</>
	)
}

interface PlayListItemProps {
	open: boolean
	setOpen: (open: boolean) => void
	playList: PlayTrack[]
	children: React.ReactNode
	playTrackId: string
}

function PlayListMobile({ open, setOpen, children, playList, playTrackId }: PlayListItemProps) {
	const removeTrack = (index: number) => {
		// 当前播放的歌曲被删除时，播放下一首歌曲
		const newPlayList = playList.filter((_, i) => i !== index)
		$playList.set(newPlayList)
		if (playTrackId === playList[index].id) {
			$playTrack.set(newPlayList[index])
		}
	}

	return (
		<Drawer open={open} onOpenChange={setOpen} direction="bottom">
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerPortal>
				<DrawerContent className="h-[90%]">
					<div aria-hidden className="mx-auto mt-4 h-2 w-[60px] rounded-full bg-muted" />
					<VisuallyHidden>
						<DrawerTitle className="text-2xl font-bold">music playlist</DrawerTitle>
						<DrawerDescription>music playlist</DrawerDescription>
					</VisuallyHidden>
					<div className="flex flex-col gap-2 px-6 py-4">
						{playList.map((item, index) => (
							<div
								className={`flex items-center justify-between ${
									playTrackId === item.id ? 'text-orange-500' : ''
								}`}
								key={index}
								onClick={() => {
									$playTrack.set(item)
									setOpen(false)
								}}
							>
								<span>{item.songName}</span>
								<div className="flex items-center gap-2">
									<span>{item.songArtist}</span>
									<X
										className="size-6 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation()
											removeTrack(index)
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	)
}

function PlayListDesktop({ open, setOpen, children, playList, playTrackId }: PlayListItemProps) {
	const removeTrack = (index: number) => {
		// 当前播放的歌曲被删除时，播放下一首歌曲
		const newPlayList = playList.filter((_, i) => i !== index)
		$playList.set(newPlayList)
		if (playTrackId === playList[index].id) {
			$playTrack.set(newPlayList[index])
		}
	}

	const isActiveSongIndex = playList.findIndex((item) => item.id === playTrackId)

	return (
		<Drawer open={open} onOpenChange={setOpen} direction="bottom" modal={false}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerPortal>
				<DrawerContent className="bottom-[100px] mx-auto h-[300px] max-w-screen-lg bg-slate-100/60 backdrop-blur-md dark:bg-zinc-900/60">
					<VisuallyHidden>
						<DrawerTitle className="text-2xl font-bold">music playlist</DrawerTitle>
						<DrawerDescription>music playlist</DrawerDescription>
					</VisuallyHidden>
					<div className="flex h-10 items-center justify-between">
						<div className="ml-2 text-lg">播放列表：{playList.length}</div>
						<X className="mr-2 size-6 cursor-pointer" onClick={() => setOpen(false)} />
					</div>
					<div className="overflow-y-auto px-6 py-4">
						<div className="flex flex-col gap-2">
							{playList.map((item, index) => (
								<div
									className={`flex cursor-pointer items-center justify-between ${
										index === isActiveSongIndex ? 'text-orange-500' : ''
									}`}
									key={index}
									onClick={() => {
										$playTrack.set(item)
									}}
								>
									<span>{item.songName}</span>
									<div className="flex items-center gap-2">
										<span>{item.songArtist}</span>
										<X
											className="size-6 cursor-pointer"
											onClick={(e) => {
												e.stopPropagation()
												removeTrack(index)
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	)
}
