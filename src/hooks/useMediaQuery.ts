import { useState, useEffect } from 'react'

/**
 * useMediaQuery - 自定义 Hook，用于检测媒体查询状态
 * @param query 媒体查询字符串，例如 "(min-width: 768px)"
 * @returns 匹配结果：true 或 false
 */
function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(false)

	useEffect(() => {
		const mediaQueryList = window.matchMedia(query)

		// 初始化状态
		setMatches(mediaQueryList.matches)

		// 监听变化事件
		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches)
		}

		// 绑定监听器（兼容性：标准和非标准方式）
		if (mediaQueryList.addEventListener) {
			mediaQueryList.addEventListener('change', listener)
		} else {
			mediaQueryList.addListener(listener) // 旧版浏览器兼容
		}

		// 清理监听器
		return () => {
			if (mediaQueryList.removeEventListener) {
				mediaQueryList.removeEventListener('change', listener)
			} else {
				mediaQueryList.removeListener(listener)
			}
		}
	}, [query])

	return matches
}

export default useMediaQuery
