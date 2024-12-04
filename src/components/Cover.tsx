import { useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import { isPlaying as isPlayingStore, playTrack } from '@/store'
interface Props {
	albumId: string
	songArtist: string
	songImgHref: string
	songName: string
}

export default function Cover({ albumId, songArtist, songImgHref, songName }: Props) {
	const isPlaying = useStore(isPlayingStore)
	const { albumId: currentAlbumId } = useStore(playTrack)
	const [isPlayingCurrentRecord, setIsPlayingCurrentRecord] = useState(false)

	useEffect(() => {
		setIsPlayingCurrentRecord(isPlaying && currentAlbumId === albumId)
	}, [currentAlbumId, isPlaying])

	const className =
		'absolute top-0 opacity-0 vynil-animation-in' + (isPlayingCurrentRecord ? '-spinning' : '')

	return (
		<div className="relative mr-32 shadow-xl md:w-auto">
			<img
				src={songImgHref}
				alt={`${songArtist} - ${songName} album cover`}
				width={400}
				height={400}
				className="relative z-10 block size-[400px] rounded-md shadow-md"
				style={{ viewTransitionName: `album-${albumId}` }}
			/>
			<img
				src="/vynil-lp.webp"
				alt=""
				width={400}
				height={400}
				style={{ viewTransitionName: `vynil-${albumId}` }}
				className={className}
			/>
		</div>
	)
}
