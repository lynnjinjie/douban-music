import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn('relative flex h-2 w-full touch-none select-none items-center', className)}
		{...props}
	>
		<SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden rounded-none bg-secondary">
			<SliderPrimitive.Range className="absolute h-full bg-orange-500" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="block size-4 rounded-full border-2 border-orange-500 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
	</SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
