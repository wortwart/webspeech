'use strict'

// Controls
const $textfield = document.getElementById('text')
const $btnSpeak = document.getElementById('btnSpeak')

// Speak button texts
const startText = $btnSpeak.textContent
const pauseText = $btnSpeak.dataset.pause
const resumeText = $btnSpeak.dataset.resume

// On play
$btnSpeak.addEventListener('click', ev => {
	ev.preventDefault()
	if (!('speechSynthesis' in window))
		return alert('Keine Sprachausgabe!')

	const
		rate = 1.25,
		pitch = 1,
		volume = 1

	// Create new utterance
	const toSpeak = new SpeechSynthesisUtterance()

	// Handle pause/resume and paused+finished state
	if (speechSynthesis.paused) {
		speechSynthesis.resume()
		if (speechSynthesis.speaking)
			return
	} else {
		if (speechSynthesis.speaking)
			return speechSynthesis.pause()
	}

	// Handle events
	toSpeak.onpause = ev => {
		console.log(ev.type)
		$btnSpeak.textContent = resumeText
	}

	toSpeak.onresume = ev => {
		console.log(ev.type)
		$btnSpeak.textContent = pauseText
	}

	toSpeak.onstart = ev => {
		console.log(ev.type)
		$btnSpeak.textContent = pauseText
	}

	toSpeak.onend = ev => {
		console.log('Ende nach ' + ev.elapsedTime + ' ms')
		$btnSpeak.textContent = startText
	}

	// Apply settings and text
	toSpeak.text = $textfield.textContent
	toSpeak.rate = rate
	toSpeak.pitch = pitch
	toSpeak.volume = volume
	speechSynthesis.speak(toSpeak)
})
