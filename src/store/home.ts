import { atom } from 'nanostores'

export type MusicLayout = 'list' | 'grid'

export const $MusicLayout = atom<MusicLayout>(
	typeof localStorage !== 'undefined' && localStorage.getItem('musicLayout')
		? JSON.parse(localStorage.getItem('musicLayout')!)
		: 'grid'
)

$MusicLayout.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('musicLayout', JSON.stringify(value))
	}
})
