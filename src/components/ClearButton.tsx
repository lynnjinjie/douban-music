import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function ClearButton() {
	const clearData = () => {
		window.localStorage.clear()
		window.location.reload()
	}
	return (
		<button className="ml-2 text-gray-500" onClick={clearData} title="清除播放列表数据">
			<Trash2 className="size-4" />
		</button>
	)
}
