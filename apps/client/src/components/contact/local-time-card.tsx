'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'components/icons'
import { classNames } from 'utils/classNames'

// Always shows the time in India, where Koushik works, whatever the visitor's time zone.
const IST_TIME = new Intl.DateTimeFormat('en-US', {
	timeZone: 'Asia/Kolkata',
	hour: 'numeric',
	minute: '2-digit',
	second: '2-digit',
	hour12: true,
})

const IST_HOUR = new Intl.DateTimeFormat('en-US', {
	timeZone: 'Asia/Kolkata',
	hour: 'numeric',
	hour12: false,
})

export const LocalTimeCard = () => {
	const [time, setTime] = useState('')
	const [workHours, setWorkHours] = useState(true)

	useEffect(() => {
		const tick = () => {
			const now = new Date()
			const hour = Number.parseInt(IST_HOUR.format(now), 10)

			setTime(IST_TIME.format(now))
			setWorkHours(hour >= 9 && hour < 22)
		}

		tick()
		const timer = setInterval(tick, 1000)

		return () => clearInterval(timer)
	}, [])

	return (
		<>
			<div className='border-border flex items-center justify-between border-b pb-3'>
				<div className='text-muted-foreground flex items-center gap-2 font-mono text-[0.6875rem] tracking-wider uppercase'>
					<Clock className='text-signal-ink size-3.5' />
					<span>Live Telemetry</span>
				</div>
				<span className='border-border bg-background text-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem]'>
					<span
						className={classNames(
							'size-1.5 rounded-full',
							workHours ? 'bg-success animate-pulse' : 'bg-warning',
						)}
					/>
					{workHours ? 'Active Hours' : 'After Hours'}
				</span>
			</div>

			<div className='grid grid-cols-2 gap-4 font-mono text-xs'>
				<div>
					<span className='text-muted-foreground block text-[0.625rem] uppercase'>
						Local Time (IST)
					</span>
					<span className='text-foreground mt-1 block font-semibold tracking-tight'>
						{time || 'Loading…'}
					</span>
				</div>
				<div>
					<span className='text-muted-foreground block text-[0.625rem] uppercase'>
						Typical Response
					</span>
					<span className='text-signal-ink mt-1 block font-semibold'>Usually within a day</span>
				</div>
			</div>
		</>
	)
}
