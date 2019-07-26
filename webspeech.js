;+function() {
	'use strict'
	if (!('speechSynthesis' in window))
		return alert('Keine Sprachausgabe!')

	const
		$controls = [],
		baseLang = document.querySelector('html').lang

	let
		text,
		rate = 1,
		pitch = 1,
		volume = .5,
		lang = baseLang,
		voices = [],
		voice,
		startText,
		pauseText,
		resumeText

	const speak = ev => {
		ev.preventDefault()

		// Handle pause/resume and paused+finished state
		if (speechSynthesis.paused) {
			speechSynthesis.resume()
			if (speechSynthesis.speaking)
				return
		} else {
			if (speechSynthesis.speaking)
				return speechSynthesis.pause()
		}
		//speechSynthesis.cancel()	// is this necessary/useful?

		// Create new utterance
		const toSpeak = new SpeechSynthesisUtterance()

		// Handle events
		toSpeak.onpause = ev => {
			console.log(ev.type)
			$btnSpeak.textContent = resumeText
		}

		toSpeak.onresume = ev => {
			console.log(ev.type)
			$btnSpeak.textContent = pauseText
		}

		toSpeak.onmark = ev => {
			console.log(ev)
		}

		toSpeak.onstart = ev => {
			console.log(ev.type, text)
			$btnSpeak.textContent = pauseText
			changeControls()
		}

		toSpeak.onend = ev => {
			console.log('Ende nach ' + ev.elapsedTime + ' ms')
			$btnSpeak.textContent = startText
			$textfield.textContent = text
			changeControls(true)
		}

		// Highlight spoken word
		toSpeak.onboundary = ev => {
			if (ev.name === 'word') {
				let i = ev.charIndex
				while (i < text.length) {
					if (text[i].match(/\W/) || i === text.length - 1) {
						let lastLetterInx = i
						if (text[i].match(/\w/) && i === text.length - 1)
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

		// Apply settings and text
		text = $textfield.textContent
		toSpeak.text = text
		toSpeak.rate = rate
		toSpeak.pitch = (voice.name === 'Microsoft Hedda Desktop - German')? 1 : pitch
		toSpeak.volume = volume
		toSpeak.lang = lang
		toSpeak.voice = voice
		speechSynthesis.speak(toSpeak)
		console.log(toSpeak, speechSynthesis)
	}

	// Read settings
	const setRate = ev => {
		rate = parseFloat(ev.target.value)
	}

	const setPitch = ev => {
		pitch = parseFloat(ev.target.value)
	}

	const setVolume = ev => {
		volume = parseFloat(ev.target.value)
	}

	const setVoice = ev => {
		if (ev)
			voice = voices[ev.target.selectedIndex]
		else
			voice = getDefaultVoice()
		lang = voice.lang
	}

	const getDefaultVoice = () => {
		if (!voices.length) {
			throw 'Browser provides no voices'
			return
		}
		let inx = voices.findIndex(vc => vc.default === true)
		if (inx < 0)
			inx = voices.findIndex(vc => vc.lang.indexOf(baseLang) === 0)
		if (inx < 0)
			inx = 0
		$voiceSelect.selectedIndex = inx
		return voice = voices[inx]
	}

	/*
	const setLang = ev => {
		if (typeof ev === 'undefined' && typeof voice === 'object')
			lang = voice.lang
		else
			lang = ev.target.value
	}
	*/

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

	// Controls
	const $textfield = document.getElementById('text')
	const $rateRange = document.getElementById('rate')
	const $pitchRange = document.getElementById('pitch')
	const $volumeRange = document.getElementById('volume')
	const $voiceSelect = document.getElementById('voice')
	const $btnSpeak = document.getElementById('btnSpeak')
	const $btnReset = document.getElementById('btnReset')
	$rateRange.addEventListener('change', setRate)
	$pitchRange.addEventListener('change', setPitch)
	$volumeRange.addEventListener('change', setVolume)
	//document.getElementById('lang').addEventListener('change', setLang)
	$voiceSelect.addEventListener('change', setVoice)
	$btnSpeak.addEventListener('click', speak)
	$btnReset.addEventListener('click', reset)
	$controls.push($rateRange, $pitchRange, $volumeRange, $voiceSelect, $btnReset)

	// Speak button texts
	startText = $btnSpeak.textContent
	pauseText = $btnSpeak.dataset.pause
	resumeText = $btnSpeak.dataset.resume

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
	voiceSelection()
	speechSynthesis.onvoiceschanged = voiceSelection
}()