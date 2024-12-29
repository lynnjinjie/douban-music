import { atom } from 'nanostores'

export type PlayTrack = {
	id: string
	albumId: string
	index: number
	songArtist: string
	songName: string
	songImgHref: string
	mp3Url: string
	duration?: string
}

export const $playTrack = atom<PlayTrack>(
	typeof localStorage !== 'undefined' && localStorage.getItem('playTrack')
		? JSON.parse(localStorage.getItem('playTrack')!)
		: {
				id: '',
				albumId: '',
				index: 0,
				songArtist: '',
				songName: '',
				songImgHref: '',
				mp3Url: '',
				duration: ''
			}
)

$playTrack.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('playTrack', JSON.stringify(value))
	}
})

export const $isPlaying = atom(
	typeof localStorage !== 'undefined' && localStorage.getItem('isPlaying')
		? JSON.parse(localStorage.getItem('isPlaying')!)
		: false
)

$isPlaying.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('isPlaying', JSON.stringify(value))
	}
})

export const $playList = atom<PlayTrack[]>(
	typeof localStorage !== 'undefined' && localStorage.getItem('playList')
		? JSON.parse(localStorage.getItem('playList')!)
		: []
)

$playList.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('playList', JSON.stringify(value))
	}
})
