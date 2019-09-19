if ('AudioContext' in window || 'webkitAudioContext' in window) {
	const audioCtx = new (AudioContext || webkitAudioContext)
	const volume = audioCtx.createGain()
	volume.connect(audioCtx.destination)
	volume.gain.value = .1
	const pitch = audioCtx.createOscillator()
	pitch.frequency.value = 261.63
	pitch.connect(volume)
	pitch.start()
	document.getElementById('btnPlay').addEventListener('click', ev => {
		ev.preventDefault()
		if (audioCtx.state === 'suspended') {
			audioCtx.resume()
		} else
			audioCtx.suspend()
	})

	document.getElementById('volume').addEventListener('change', ev => volume.gain.setValueAtTime(ev.target.value, volume.context.currentTime))

	document.getElementById('pitch').addEventListener('change', ev => pitch.frequency.setValueAtTime(ev.target.value, pitch.context.currentTime))

} else {
	alert('Keine Audio-Aufzeichnung!')
}
