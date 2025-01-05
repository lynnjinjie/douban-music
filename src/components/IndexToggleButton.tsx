import { List, Grid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@nanostores/react'
import { $MusicLayout } from '@/store'

export default function IndexToggleButton() {
	const musicLayout = useStore($MusicLayout)

	const isList = musicLayout === 'list'

	const handleToggle = (isList: boolean) => {
		$MusicLayout.set(isList ? 'list' : 'grid')
	}

	return (
		<div className="grid grid-cols-2 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
			<Button
				className={cn(!isList && 'bg-background text-foreground')}
				onClick={() => handleToggle(false)}
			>
				<Grid className="size-4" />
			</Button>
			<Button
				className={cn(isList && 'bg-background text-foreground')}
				onClick={() => handleToggle(true)}
			>
				<List className="size-4" />
			</Button>
		</div>
	)
}

function Button({
	children,
	className,
	onClick
}: {
	children: React.ReactNode
	className?: string
	onClick?: () => void
}) {
	return (
		<button
			className={cn('cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium', className)}
			onClick={onClick}
		>
			{children}
		</button>
	)
}
