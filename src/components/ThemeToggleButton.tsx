import { useEffect, useState } from 'react'

import { SunIcon, MoonIcon } from '@/components/Icons'

const themes = ['light', 'dark']

export default function ThemeToggle() {
	const [isMounted, setIsMounted] = useState(false)
	const [theme, setTheme] = useState(() => {
		if (import.meta.env.SSR) {
			return undefined
		}
		if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
			return localStorage.getItem('theme')
		}
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark'
		}
		return 'light'
	})

	const toggleTheme = () => {
		const t = theme === 'light' ? 'dark' : 'light'
		localStorage.setItem('theme', t)
		setTheme(t)
		const favicon = document.getElementById('favicon') as HTMLAnchorElement
		if (favicon) {
			favicon.href = t === 'dark' ? '/music-dark.svg' : '/music.svg'
		}
	}
	useEffect(() => {
		const root = document.documentElement
		if (theme === 'light') {
			root.classList.remove('dark')
		} else {
			root.classList.add('dark')
		}
	}, [theme])

	useEffect(() => {
		setIsMounted(true)
	}, [])

	return isMounted ? (
		<div className="inline-flex items-center rounded-3xl bg-orange-300 p-[1px] dark:bg-zinc-600">
			{themes.map((t) => {
				const checked = t === theme
				return (
					<button
						key={t}
						className={`${checked ? 'bg-white text-black' : ''} cursor-pointer rounded-3xl p-2`}
						onClick={toggleTheme}
						aria-label="Toggle theme"
					>
						{t === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
					</button>
				)
			})}
		</div>
	) : (
		<div></div>
	)
}
