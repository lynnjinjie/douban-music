import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
	DrawerTrigger,
	DrawerPortal
} from '@/components/ui/drawer'
import { AudioLines, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useStore } from '@nanostores/react'
import { $isPlaying, $playList, $playTrack, initPlayTrack, type PlayTrack } from '@/store'
import useMediaQuery from '@/hooks/useMediaQuery'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { FillPauseIcon, FillPlayIcon } from '@/components/Icons'
import { cn } from '@/lib/utils'

export default function PlayList({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const [hightlightSongId, setHightlightSongId] = useState('')
	const playList = useStore($playList)

	const isMobile = useMediaQuery('(max-width: 768px)')

	const { id: playTrackId } = useStore($playTrack)

	const isPlaying = useStore($isPlaying)

	const playListRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		setHightlightSongId(playTrackId)
		// 等待 DOM 更新后再获取 ref
		setTimeout(() => {
			if (open && playListRef.current) {
				const highlightedElement = playListRef.current.querySelector(
					`[data-track-id="${playTrackId}"]`
				)
				highlightedElement?.scrollIntoView({ behavior: 'auto', block: 'center' })
			}
		}, 0)
	}, [open, playTrackId])

	const removeTrack = (index: number) => {
		// 删除的歌曲是否为当前歌曲
		const isCurrentSong = playTrackId === playList[index].id
		// 当前播放的歌曲被删除时，播放下一首歌曲
		const newPlayList = playList.filter((_, i) => i !== index)
		$playList.set(newPlayList)
		// 如果 newPlayList 为空，则设置为空
		if (newPlayList.length === 0) {
			$playTrack.set(initPlayTrack)
			setOpen(false)
			return
		}
		// 如果当前删除的是正在播放的最后一个歌曲，则播放上一首歌曲
		if (index === newPlayList.length && isCurrentSong) {
			$playTrack.set(newPlayList[index - 1])
			return
		}
		if (playTrackId === playList[index].id) {
			$playTrack.set(newPlayList[index])
		}
	}

	const handleHightlight = (id: string) => {
		setHightlightSongId(id)
	}

	return (
		<>
			{isMobile ? (
				<PlayListMobile
					open={open}
					setOpen={setOpen}
					playList={playList}
					children={children}
					playTrackId={playTrackId}
					removeTrack={removeTrack}
					isPlaying={isPlaying}
					hightlightSongId={hightlightSongId}
					handleHightlight={handleHightlight}
					playListRef={playListRef}
				/>
			) : (
				<PlayListDesktop
					open={open}
					setOpen={setOpen}
					playList={playList}
					children={children}
					playTrackId={playTrackId}
					removeTrack={removeTrack}
					isPlaying={isPlaying}
					hightlightSongId={hightlightSongId}
					handleHightlight={handleHightlight}
					playListRef={playListRef}
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
	isPlaying: boolean
	removeTrack: (index: number) => void
	hightlightSongId: string
	handleHightlight: (id: string) => void
	playListRef: React.RefObject<HTMLDivElement>
}

function PlayListMobile({
	open,
	setOpen,
	children,
	playList,
	playTrackId,
	removeTrack,
	isPlaying,
	hightlightSongId,
	handleHightlight,
	playListRef
}: PlayListItemProps) {
	return (
		<Drawer open={open} onOpenChange={setOpen} direction="bottom">
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerPortal>
				<DrawerContent className="h-[70%]">
					<div aria-hidden className="mx-auto my-2 h-4 w-[60px] rounded-full bg-muted" />
					<VisuallyHidden>
						<DrawerTitle className="text-2xl font-bold">music playlist</DrawerTitle>
						<DrawerDescription>music playlist</DrawerDescription>
					</VisuallyHidden>
					<div
						className="hide-scrollbar flex flex-col gap-2 overflow-y-auto py-4"
						ref={playListRef}
					>
						{playList.map((item, index) => (
							<div
								data-track-id={item.id}
								className={cn(
									'flex items-center justify-between px-2 py-1',
									playTrackId === item.id && 'text-orange-500',
									hightlightSongId === item.id && 'bg-orange-500/10'
								)}
								key={index}
								onClick={() => {
									handleHightlight(item.id)
								}}
							>
								<div className="flex flex-1 items-center gap-2">
									<span className="inline-flex w-10 items-center justify-center">
										{isPlaying && item.id === playTrackId ? (
											<AudioLines className="size-4" />
										) : (
											<span>{index + 1}</span>
										)}
									</span>
									<div className="flex flex-1 items-center gap-2">
										<div
											className="relative size-10 rounded-md bg-neutral-200"
											onClick={(e) => {
												if (item.id === playTrackId) {
													$isPlaying.set(!isPlaying)
												} else {
													$playTrack.set(item)
													$isPlaying.set(true)
												}
												setOpen(false)
											}}
										>
											<img
												src={item.songImgHref}
												alt={item.songName}
												className="size-full rounded-md"
											/>
											<span
												className={cn(
													'absolute inset-0 flex items-center justify-center rounded-md bg-black/40',
													hightlightSongId === item.id ? 'opacity-100' : 'opacity-0'
												)}
											>
												{isPlaying && item.id === playTrackId ? (
													<FillPauseIcon
														className={cn(
															'size-4 text-white',
															item.id === playTrackId && 'text-orange-500'
														)}
													/>
												) : (
													<FillPlayIcon
														className={cn(
															'size-4 text-white',
															item.id === playTrackId && 'text-orange-500'
														)}
													/>
												)}
											</span>
										</div>
										<div className="flex flex-col">
											<span className="line-clamp-1 text-base">{item.songName}</span>
											<span className="line-clamp-1 text-sm text-neutral-400">
												{item.songArtist}
											</span>
										</div>
									</div>
								</div>
								<div className="flex w-6 items-center gap-2">
									<X
										className={cn(
											'hidden size-6 cursor-pointer',
											hightlightSongId === item.id && 'block'
										)}
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

function PlayListDesktop({
	open,
	setOpen,
	children,
	playList,
	playTrackId,
	removeTrack,
	isPlaying,
	hightlightSongId,
	handleHightlight,
	playListRef
}: PlayListItemProps) {
	return (
		<Drawer open={open} onOpenChange={setOpen} direction="bottom" modal={false}>
			<DrawerTrigger asChild onClick={() => setOpen(!open)}>
				{children}
			</DrawerTrigger>
			<DrawerPortal>
				<DrawerContent className="bottom-[80px] mx-auto h-[400px] max-w-screen-lg">
					<VisuallyHidden>
						<DrawerTitle className="text-2xl font-bold">music playlist</DrawerTitle>
						<DrawerDescription>music playlist</DrawerDescription>
					</VisuallyHidden>
					<div className="flex h-10 items-center justify-between">
						<div className="ml-2 text-lg">播放列表：{playList.length}</div>
						<X className="mr-2 size-6 cursor-pointer" onClick={() => setOpen(false)} />
					</div>
					<div className="overflow-y-auto py-4" ref={playListRef}>
						<div className="flex flex-col">
							{playList.map((item, index) => (
								<div
									data-track-id={item.id}
									className={cn(
										'group flex cursor-pointer items-center justify-between px-2 py-2 hover:bg-orange-500/10',
										item.id === playTrackId && 'text-orange-500',
										hightlightSongId === item.id && 'bg-orange-500/10'
									)}
									key={index}
									onClick={() => {
										handleHightlight(item.id)
									}}
								>
									<div className="flex items-center gap-2">
										<div className="inline-flex w-10 items-center justify-center">
											{isPlaying && item.id === playTrackId ? (
												<AudioLines className="size-4 text-orange-500" />
											) : (
												<span>{index + 1}</span>
											)}
										</div>
										<div className="flex items-center gap-2">
											<div
												className="relative size-12 rounded-md bg-neutral-200"
												onClick={(e) => {
													e.stopPropagation()
													$playTrack.set(item)
													$isPlaying.set(true)
													setOpen(false)
												}}
											>
												<img
													src={item.songImgHref}
													alt={item.songName}
													className="size-full rounded-md"
												/>
												<span
													className={cn(
														'absolute inset-0 flex items-center justify-center rounded-md bg-black/40',
														hightlightSongId === item.id ? 'opacity-100' : 'opacity-0',
														'group-hover:opacity-100'
													)}
												>
													{isPlaying && item.id === playTrackId ? (
														<FillPauseIcon
															className={cn(
																'size-4 text-white',
																item.id === playTrackId && 'text-orange-500'
															)}
														/>
													) : (
														<FillPlayIcon
															className={cn(
																'size-4 text-white',
																item.id === playTrackId && 'text-orange-500'
															)}
														/>
													)}
												</span>
											</div>
											<div className="flex flex-col">
												<span className="line-clamp-1 text-base">{item.songName}</span>
												<span className="line-clamp-1 text-sm text-neutral-400">
													{item.songArtist}
												</span>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<X
											className={cn(
												'hidden size-6 cursor-pointer',
												hightlightSongId === item.id && 'block',
												'group-hover:block'
											)}
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
