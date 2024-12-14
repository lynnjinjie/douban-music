import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
	DrawerTrigger,
	DrawerPortal
} from '@/components/ui/drawer'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { $playList, type PlayTrack } from '@/store'
import useMediaQuery from '@/hooks/useMediaQuery'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function PlayList({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const playList = useStore($playList)

	const isMobile = useMediaQuery('(max-width: 768px)')

	return (
		<>
			{isMobile ? (
				<PlayListMobile open={open} setOpen={setOpen} playList={playList} children={children} />
			) : (
				<PlayListDesktop open={open} setOpen={setOpen} playList={playList} children={children} />
			)}
		</>
	)
}

interface PlayListItemProps {
	open: boolean
	setOpen: (open: boolean) => void
	playList: PlayTrack[]
	children: React.ReactNode
}

function PlayListMobile({ open, setOpen, children, playList }: PlayListItemProps) {
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
							<div className="flex items-center justify-between" key={index}>
								<span>{item.songName}</span>
								<span>{item.songArtist}</span>
							</div>
						))}
					</div>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	)
}

function PlayListDesktop({ open, setOpen, children, playList }: PlayListItemProps) {
	return (
		<Drawer open={open} onOpenChange={setOpen} direction="bottom" modal={false}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerPortal>
				<DrawerContent className="bottom-[100px] mx-auto h-[300px] max-w-screen-lg bg-zinc-400/60 backdrop-blur-md dark:bg-zinc-900/60">
					<VisuallyHidden>
						<DrawerTitle className="text-2xl font-bold">music playlist</DrawerTitle>
						<DrawerDescription>music playlist</DrawerDescription>
					</VisuallyHidden>
					<div className="flex h-10 items-center justify-end">
						<X className="mr-2 size-6 cursor-pointer" onClick={() => setOpen(false)} />
					</div>
					<div className="overflow-y-auto px-6 py-4">
						<div className="flex flex-col gap-2">
							{playList.map((item, index) => (
								<div className="flex items-center justify-between" key={index}>
									<span>{item.songName}</span>
									<span>{item.songArtist}</span>
								</div>
							))}
						</div>
					</div>
					<DrawerClose />
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	)
}
