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
		'absolute top-0 opacity-0 aspect-square size-[270px] sm:size-[400px] vynil-animation-in' +
		(isPlayingCurrentRecord ? '-spinning' : '')

	return (
		<div className="relative shadow-xl sm:mr-32 md:w-auto">
			<img
				src={songImgHref}
				alt={`${songArtist} - ${songName} album cover`}
				className="relative z-10 block aspect-square size-[270px] rounded-md shadow-md sm:size-[400px]"
				style={{ viewTransitionName: `album-${albumId}` }}
			/>
			<img
				src="/vynil-lp.webp"
				alt=""
				style={{ viewTransitionName: `vynil-${albumId}` }}
				className={className}
			/>
		</div>
	)
}
