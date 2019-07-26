;+function() {
	'use strict'
	if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))
		return alert('Keine Spracherkennung!')

	const startText = 'Eingabe starten'
	const endText = 'Eingabe beenden'
	const runningText = 'Aufnahme läuft'

	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
	const recog = new SpeechRecognition()
	recog.continuous = true
	recog.lang = 'de-DE'
	recog.interimResults = true
	recog.maxAlternatives = 1
	let recording = false

	// UI elements
	const btn = document.createElement('button')
	btn.setAttribute('autofocus', true)
	btn.textContent = startText
	document.body.append(btn)

	const status = document.createElement('p')
	status.classList.add('status')
	status.textContent = ''
	document.body.append(status)

	const statusRecog = document.createElement('ul')
	document.body.append(statusRecog)

	const resultDiv = document.createElement('div')
	resultDiv.classList.add('result')
	document.body.append(resultDiv)

	// Start and stop voice recognition
	const startRecog = () => {
		recog.start()
		btn.textContent = endText
		status.textContent = runningText
		recording = true
		console.info('Recognition started')
	}

	const stopRecog = () => {
		recog.stop()
		btn.textContent = startText
		if (status.textContent === runningText)
			status.textContent = ''
		recording = false
		console.info('Recognition stopped')
	}

	btn.onclick = ev => {
		if (recording)
			stopRecog()
		else
			startRecog()
	}

	// Handle result
	recog.onresult = ev => {
		console.info(ev.results)
		const texts = []
		while (statusRecog.firstChild)
			statusRecog.removeChild(statusRecog.firstChild)
		for (let i = 0; i < ev.results.length; i++) {
			texts.push(ev.results[i][0].transcript)
			const li = document.createElement('li')
			li.textContent = 'Ergebnis: ' + ev.results[i][0].transcript + ', Verlässlichkeit: ' + ev.results[i][0].confidence
			statusRecog.append(li)
		}
		resultDiv.textContent = texts.join('. ')
	}

	recog.onspeechend = () => stopRecog()

	recog.onnomatch = () => {
		status.textContent = 'Eingabe nicht erkannt'
		stopRecog()
	}

	recog.onerror = ev => {
		status.textContent = 'Fehler: ' + ev.error
		stopRecog()
	}
}()