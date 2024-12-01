import { atom } from 'nanostores'

export type PlayTrack = {
	albumId: string
	index: number
	songArtist: string
	songName: string
	songImgHref: string
	mp3Url: string
}

export const playTrack = atom<PlayTrack>({
	albumId: '',
	index: 0,
	songArtist: '',
	songName: '',
	songImgHref: '',
	mp3Url: ''
})

export const isPlaying = atom(false)
