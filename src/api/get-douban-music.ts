interface SongItem {
	id: number
	name: string
	mp3Url: string
}

export interface MusicItem {
	id: string
	songName: string
	songImgHref: string
	songDoubanHref: string
	songArtist: string
	songYear: string
	songAlbumType: string
	songMedium: string
	songStyle: string
	songItemList: SongItem[]
}

export const doubanMusicUrl = import.meta.env.API_URL + '/douban-music'

export async function getDoubanMusic(): Promise<MusicItem[]> {
	const response = await fetch(doubanMusicUrl)
	const musicList = await response.json()
	return musicList
}
