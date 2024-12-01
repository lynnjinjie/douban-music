export const PlayIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={` ${className}`}
			aria-hidden="true"
			focusable="false"
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="m10 8l6 4l-6 4z" />
			</g>
		</svg>
	)
}

export const PauseIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={` ${className}`}
			aria-hidden="true"
			focusable="false"
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M10 15V9m4 6V9" />
			</g>
		</svg>
	)
}
export const MusicIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={` ${className}`}
			aria-hidden="true"
			focusable="false"
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<path d="M9 18V5l12-2v13" />
				<circle cx="6" cy="18" r="3" />
				<circle cx="18" cy="16" r="3" />
			</g>
		</svg>
	)
}
