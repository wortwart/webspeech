;+function() {
	'use strict'
	if (!('AudioContext' in window) && !('webkitAudioContext' in window))
		return alert('Keine Audio-Aufzeichnung!')

	const $volumeControl = document.getElementById('volume')
	const $pitchControl = document.getElementById('pitch')
	const $speedControl = document.getElementById('speed')
	const $btnSound = document.getElementById('btnSound')
	const startText = $btnSound.textContent
	const pauseText = $btnSound.dataset.pause
	const resumeText = $btnSound.dataset.resume
	let speed = 0

	const audioCtx1 = new (AudioContext || webkitAudioContext)
	audioCtx1.suspend()
	const volume1 = audioCtx1.createGain()
	volume1.connect(audioCtx1.destination)

	const sine = audioCtx1.createOscillator()
	sine.connect(volume1)
	sine.start()

	const setVolume = ev => {
		volume1.gain.value = parseFloat($volumeControl.value)
		volume2.gain.value = parseFloat($volumeControl.value)
	}

	const setPitch = ev => {
		sine.frequency.value = parseFloat($pitchControl.value)
	}

	const playPause = ev => {
		ev.preventDefault()
		if (audioCtx1.state === 'suspended') {
			audioCtx1.resume()
			$btnSound.textContent = pauseText
		}
		else if (audioCtx1.state === 'running') {
			audioCtx1.suspend()
			$btnSound.textContent = resumeText
		}
		else
			console.warn(audioCtx1.state)
	}

	const setSpeed = ev => {
		speed = parseFloat($speedControl.value)
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

	const audioCtx2 = new (AudioContext || webkitAudioContext)
	const volume2 = audioCtx2.createGain()
	volume2.connect(audioCtx2.destination)

	const playKey = ev => {
		console.log(ev.target.id.slice(3))
		const sine = audioCtx2.createOscillator()
		sine.connect(volume2)
		sine.frequency.value = parseFloat(freqs.get(ev.target.id.slice(3)))
		sine.start()
		sine.stop(audioCtx2.currentTime + speed)
	}

	$volumeControl.addEventListener('change', setVolume);
	setVolume()
	$pitchControl.addEventListener('change', setPitch);
	setPitch()
	$btnSound.addEventListener('click', playPause);
	$speedControl.addEventListener('change', setSpeed);
	setSpeed()
	for (let key of freqs.keys())
		document.getElementById('btn' + key).addEventListener('click', playKey)

}()