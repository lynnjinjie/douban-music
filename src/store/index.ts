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

export const initPlayTrack: PlayTrack = {
	id: '',
	albumId: '',
	index: 0,
	songArtist: '',
	songName: '',
	songImgHref: '',
	mp3Url: '',
	duration: ''
}

export const $playTrack = atom(
	typeof localStorage !== 'undefined' && localStorage.getItem('playTrack')
		? JSON.parse(localStorage.getItem('playTrack')!)
		: initPlayTrack
)

$playTrack.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('playTrack', JSON.stringify(value))
	}
})

export const $isPlaying = atom(false)

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

// 上一首歌曲切换，如果是第一首，则切换到最后一首
export const handlePrevTrack = () => {
	const index = $playList.value.findIndex((item) => item.id === $playTrack.value.id)
	if (index === 0) {
		$playTrack.set($playList.value[$playList.value.length - 1])
	} else {
		$playTrack.set($playList.value[index - 1])
	}
}

// 下一首歌曲切换，如果是最后一首，则切换到第一首
export const handleNextTrack = () => {
	const index = $playList.value.findIndex((item) => item.id === $playTrack.value.id)
	if (index === $playList.value.length - 1) {
		$playTrack.set($playList.value[0])
	} else {
		$playTrack.set($playList.value[index + 1])
	}
}

export const $isInit = atom(true)
