;+function() {
	'use strict'
	if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))
		return alert('Keine Spracherkennung!')
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

	if (!('speechSynthesis' in window))
		return alert('Keine Sprachausgabe!')

	const
		recog = new SpeechRecognition(),
		toSpeak = new SpeechSynthesisUtterance(),
		$controls = []

	recog.continuous = true
	recog.lang = 'de-DE'
	recog.interimResults = true
	recog.maxAlternatives = 1

	let
		status = null,
		text,
		rate = 1,
		pitch = 1,
		volume = .5,
		lang,
		voices = [],
		voice

	// Start and stop voice recognition
	const startRecog = () => {
		recog.start()
		status = 'started'
		$btnRec.textContent = btnTexts.stop
		$status.textContent = runningText
		console.info('Recognition started')
	}

	const stopRecog = () => {
		recog.stop()
		status = 'stopped'
		$btnRec.textContent = btnTexts.play
		if ($status.textContent === runningText)
			$status.textContent = ''
		console.info('Recognition stopped')
	}

	// Handle result
	recog.onresult = ev => {
		const texts = []
		while ($statusRecog.firstChild)
			$statusRecog.removeChild($statusRecog.firstChild)
		for (let i = 0; i < ev.results.length; i++) {
			texts.push(ev.results[i][0].transcript)
			const li = document.createElement('li')
			li.textContent = 'Ergebnis: ' + ev.results[i][0].transcript + ', Verlässlichkeit: ' + ev.results[i][0].confidence
			$statusRecog.append(li)
		}
		text = texts.join('. ')
		$textfield.textContent = text
	}

	recog.onspeechend = () => stopRecog()

	recog.onnomatch = () => {
		$status.textContent = 'Eingabe nicht erkannt'
		stopRecog()
	}

	recog.onerror = ev => {
		$status.textContent = 'Fehler: ' + ev.error
		stopRecog()
	}

	// Handle events
	toSpeak.onpause = ev => {
		status = 'resumed'
		$btnRec.textContent = btnTexts.pause
	}

	toSpeak.onresume = ev => {
		status = 'paused'
		$btnRec.textContent = btnTexts.resume
	}

	toSpeak.onstart = ev => {
		status = 'playing'
		$btnRec.textContent = btnTexts.pause
		changeControls()
	}

	toSpeak.onend = ev => {
		console.info('Ende nach ' + ev.elapsedTime + ' ms')
		status = 'stopped'
		$btnRec.textContent = btnTexts.play
		$textfield.textContent = text
		changeControls(true)
	}

	// Highlight spoken word
	toSpeak.onboundary = ev => {
		if (ev.name === 'word') {
			let i = ev.charIndex
			const nonWordChars = /[\s,.:;?!"„“–-]/
			while (i < text.length) {
				if (nonWordChars.test(text[i]) || i === text.length - 1) {
					let lastLetterInx = i
					if (!nonWordChars.test(text[i]) && i === text.length - 1)
						lastLetterInx++	// text ends with letter
					const t1 = document.createTextNode(text.slice(0, ev.charIndex))
					const $em = document.createElement('em')
					$em.textContent = text.slice(ev.charIndex, lastLetterInx)
					const t2 = document.createTextNode(text.slice(lastLetterInx, text.length))
					while ($textfield.firstChild)
						$textfield.removeChild($textfield.firstChild)
					$textfield.appendChild(t1)
					$textfield.appendChild($em)
					$textfield.appendChild(t2)
					break
				}
				i++
			}
		}
	}

	const speak = () => {
		// Handle pause/resume and paused+finished state
		if (speechSynthesis.paused) {
			speechSynthesis.resume()
			if (speechSynthesis.speaking)
				return
		} else {
			if (speechSynthesis.speaking)
				return speechSynthesis.pause()
		}

		// Apply settings and text
		toSpeak.text = text
		toSpeak.rate = rate
		toSpeak.pitch = (voice.name === 'Microsoft Hedda Desktop - German')? 1 : pitch
		toSpeak.volume = volume
		if (lang)
			toSpeak.lang = lang
		toSpeak.voice = voice
		speechSynthesis.speak(toSpeak)
	}

	const action = ev => {
		ev.preventDefault()
		if (!status)
			startRecog()
		else if (status === 'started')
			stopRecog()
		else if (status === 'stopped')
			speak()
		else if (status === 'playing')
			speak()
		else if (status === 'paused')
			speak()
		else if (status === 'resumed')
			speak()
	}

	// Read settings
	const setRate = ev => {
		rate = ev.target.value
	}

	const setPitch = ev => {
		pitch = ev.target.value
	}

	const setVolume = ev => {
		volume = ev.target.value
	}

	const setVoice = ev => {
		if (ev)
			voice = voices[ev.target.selectedIndex]
		else
			voice = getDefaultVoice()
		lang = voice.lang
	}

	const getDefaultVoice = () => {
		if (!voices.length)
			throw 'Browser provides no voices'
		let inx = voices.findIndex(vc => vc.default === true)
		if (inx < 0)
			inx = 0
		$voiceSelect.selectedIndex = inx
		return voice = voices[inx]
	}

	const changeControls = enable => {
		$controls.forEach($el => enable?
			$el.removeAttribute('disabled') :
			$el.setAttribute('disabled', true)
		)
	}

	// Restore default values
	const reset = ev => {
		[$rateRange, $pitchRange, $volumeRange].forEach(field => {
			field.value = field.attributes['value']
		})
		setVoice()
	}

	// Fetch available voices
	const voiceSelection = () => {
		if (voices.length) return
		voices = speechSynthesis.getVoices()
		if (!voices.length) return
		voices.forEach(myVoice => {
			const $voiceOption = document.createElement('option')
			$voiceOption.textContent = myVoice.name
			$voiceSelect.append($voiceOption)
		})
		setVoice()
	}

	// UI elements
	const $status = document.querySelector('.status')
	const $statusRecog = document.querySelector('ul')
	const $textfield = document.querySelector('.result')
	const $rateRange = document.getElementById('rate')
	const $pitchRange = document.getElementById('pitch')
	const $volumeRange = document.getElementById('volume')
	const $voiceSelect = document.getElementById('voice')
	const $btnRec = document.getElementById('btnRec')
	const $btnReset = document.getElementById('btnReset')
	$rateRange.addEventListener('change', setRate)
	$pitchRange.addEventListener('change', setPitch)
	$volumeRange.addEventListener('change', setVolume)
	$voiceSelect.addEventListener('change', setVoice)
	$btnRec.addEventListener('click', action)
	$btnReset.addEventListener('click', reset)
	$controls.push($rateRange, $pitchRange, $volumeRange, $voiceSelect, $btnReset)

	const btnTexts = {}
	;['stop', 'play', 'pause', 'resume'].forEach(el => {
		btnTexts[el]= $btnRec.dataset[el]
	})
	const runningText = 'Aufnahme läuft'

	voiceSelection()
	speechSynthesis.onvoiceschanged = voiceSelection
}()
