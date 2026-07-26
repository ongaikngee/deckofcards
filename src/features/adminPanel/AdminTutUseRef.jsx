import React, { useState, useRef } from 'react'

const AdminTutUseRef = () => {
	const [startTime, setStartTime] = useState(null)
	const [now, setNow] = useState(null)
	const intervalRef = useRef(null)
	let ref = useRef(0)

	const handleClick = () => {
		ref.current += 1
		console.log(`You clicked ${ref.current} times!`)
	}

	const handleStart = () => {
		setStartTime(Date.now())
		setNow(Date.now())

		clearInterval(intervalRef.current)
		intervalRef.current = setInterval(() => {
			setNow(Date.now());

		}, 10)
	}

	const handleStop = () => {
		clearInterval(intervalRef.current)
	}

	let secondsPassed = 0;
	if (startTime != null && now != null) {
		secondsPassed = (now - startTime) / 1000;
	}

	return (
		<div className='container'>
			<div className='display-6'>React useRef</div>
			<div className='container m-3 d-flex gap-4'>
				<div className='container border p-3'>
					<div className='h3'>Click handle</div>
					<button className='btn btn-primary' onClick={handleClick}>Click me</button>
					<div className=''>Click on the button, there is a value that is stored. As this
						does not needed render on the screen, it can be using useRef instead of useState.
						Open the inspect panel to see the value changes and updated.
					</div>
				</div>
				<div className='container border p-3'>
					<div className='h3'>StopWatch</div>
					<div className='lead'>Time passed: {secondsPassed.toFixed(3)}</div>
					<div className='d-flex gap-2'>
						<button className='btn btn-success' onClick={handleStart}>Start</button>
						<button className='btn btn-danger' onClick={handleStop}>End</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AdminTutUseRef

