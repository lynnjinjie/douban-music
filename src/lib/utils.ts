import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatSecondsToMinutes(seconds: number) {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 把 03:01 转换为秒数
export function formatDurationToSeconds(duration: string) {
	const [minutes, seconds] = duration.split(':')
	return parseInt(minutes) * 60 + parseInt(seconds)
}
