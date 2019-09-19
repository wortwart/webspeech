;+function() {
	'use strict'
	if (!('AudioContext' in window) && !('webkitAudioContext' in window))
		return alert('Keine Audio-Aufzeichnung!')

	const volumes = []
	const $volumeControl = document.getElementById('volume')
	const $pitchControl = document.getElementById('pitch')
	const $speedControl = document.getElementById('speed')
	const $btnSound = document.getElementById('btnSound')
	const pauseText = $btnSound.dataset.pause
	const resumeText = $btnSound.dataset.resume
	const controlDelay = .5
	let speed = 0

	const setVolume = ev => {
		const volumeVal = $volumeControl.value
		if (typeof ev === 'undefined')
			volumes.forEach(vol => vol.gain.value = volumeVal)
		else
			volumes.forEach(vol => vol.gain.setValueAtTime(volumeVal, vol.context.currentTime + controlDelay))
	}

	const setPitch = ev => {
		const pitchVal = $pitchControl.value
		if (typeof ev === 'undefined')
			pitch.frequency.value = pitchVal
		else
			pitch.frequency.setValueAtTime(pitchVal, pitch.context.currentTime + controlDelay)
	}

	const setSpeed = ev => {
		speed = $speedControl.value
	}

	const playKey = ev => {
		const note = ev.target.id.slice(3)
		const freq = freqs.get(note)
		console.log(note, freq, speed)
		const pitch = audioCtxKbd.createOscillator()
		pitch.connect(volumes[volumes.length-1])
		pitch.frequency.value = freq
		pitch.start()
		pitch.stop(audioCtxKbd.currentTime + speed)
	}

	const playPause = ev => {
		ev.preventDefault()
		if (audioCtx.state === 'suspended') {
			audioCtx.resume()
			$btnSound.textContent = pauseText
		}
		else if (audioCtx.state === 'running') {
			audioCtx.suspend()
			$btnSound.textContent = resumeText
		}
		else
			console.warn(audioCtx.state)
	}

	// Sound key buttons

	const freqs = new Map([
		['C', 261.63],
		['Cc', 277.18],
		['D', 293.66],
		['Dd', 311.13],
		['E', 329.63],
		['F', 349.23],
		['Ff', 369.99],
		['G', 392],
		['Gg', 415.3],
		['A', 440],
		['Aa', 466.16],
		['H', 493.88],
		['CC', 523.25]
	])

	const audioCtx = new (AudioContext || webkitAudioContext)
	audioCtx.suspend()
	volumes.push(audioCtx.createGain())
	volumes[volumes.length-1].connect(audioCtx.destination)
	const pitch = audioCtx.createOscillator()
	pitch.connect(volumes[volumes.length-1])
	pitch.start()
	audioCtx.suspend()

	const audioCtxKbd = new (AudioContext || webkitAudioContext)
	volumes.push(audioCtxKbd.createGain())
	volumes[volumes.length-1].connect(audioCtxKbd.destination)

	$volumeControl.addEventListener('change', setVolume);
	setVolume()
	$pitchControl.addEventListener('change', setPitch);
	setPitch()
	$speedControl.addEventListener('change', setSpeed);
	setSpeed()
	$btnSound.addEventListener('click', playPause);
	for (let key of freqs.keys())
		document.getElementById('btn' + key).addEventListener('click', playKey)
}()