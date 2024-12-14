// @ts-check
import { defineConfig, sharpImageService } from 'astro/config'

import tailwind from '@astrojs/tailwind'

import react from '@astrojs/react'

import AstroPWA from '@vite-pwa/astro'

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind({
			applyBaseStyles: false
		}),
		react(),
		AstroPWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true
			},
			manifest: {
				name: '豆瓣音乐 Top250',
				short_name: '豆瓣音乐',
				description: '豆瓣音乐 Top250 Playlist',
				theme_color: '#ffffff',
				background_color: '#000000',
				icons: [
					{
						src: '/music-dark.svg',
						sizes: '128x128',
						type: 'image/svg+xml'
					},
					{
						src: '/music-dark.svg',
						sizes: '192x192',
						type: 'image/svg+xml'
					},
					{
						src: '/music-dark.svg',
						sizes: '512x512',
						type: 'image/svg+xml'
					}
				],
				screenshots: [
					{
						src: '/screenshots/desktop.png',
						sizes: '1920x1080',
						type: 'image/png',
						platform: 'wide'
					},
					{
						src: '/screenshots/mobile.png',
						sizes: '1080x1920',
						type: 'image/png',
						platform: 'narrow'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,png,svg,ico}']
			}
		})
	],
	image: {
		service: sharpImageService()
	}
})
