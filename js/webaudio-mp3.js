;+function() {
	'use strict'
	if (!('AudioContext' in window) && !('webkitAudioContext' in window))
		return alert('Kein Web Audio API!')

	const $volumeControl = document.getElementById('volume')
	const $btnMp3 = document.getElementById('btnMp3')
	const pauseText = $btnMp3.dataset.pause
	const resumeText = $btnMp3.dataset.resume

	const setVolume = ev => {
		volume.gain.setValueAtTime($volumeControl.value, volume.context.currentTime);
	}

	const playPause = ev => {
		ev.preventDefault()
		if (audioCtx.state === 'suspended') {
			audioCtx.resume()
			$btnMp3.textContent = pauseText
		}
		else if (audioCtx.state === 'running') {
			audioCtx.suspend()
			$btnMp3.textContent = resumeText
		}
		else
			console.warn(audioCtx.state)
	}

	const playSoundfile = (context, url) => {
		fetch(url)
		.then(resp => resp.arrayBuffer())
		.then(buffer => {
			context.decodeAudioData(buffer, data => {
				const source = context.createBufferSource()
				source.buffer = data
				source.connect(volume)
				source.start()
				source.loop = true
			})
		})
	}

	const audioCtx = new (AudioContext || webkitAudioContext)
	const volume = audioCtx.createGain()
	volume.connect(audioCtx.destination)
	audioCtx.suspend()

	$volumeControl.addEventListener('change', setVolume);
	setVolume()
	$btnMp3.addEventListener('click', playPause);
	playSoundfile(audioCtx, 'alphabet.mp3')
}()