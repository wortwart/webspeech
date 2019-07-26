// Inspired (ahem) by https://github.com/mdn/web-speech-api/blob/master/speech-color-changer/script.js

;+function() {
	'use strict'
	if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))
		return alert('Keine Spracherkennung!')

	const colors = [
		'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
	]
	const startText = 'Eingabe starten'
	const endText = 'Eingabe beenden'
	const runningText = 'Aufnahme läuft'

	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
	const recog = new SpeechRecognition()
	/*
		// Grammar settings are currently ignored
		const speechRecognitionList = new SpeechGrammarList()
		const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
		speechRecognitionList.addFromString(grammar, 1)
		recog.grammars = speechRecognitionList
	*/
	//recog.continuous = false	// default
	//recog.interimResults = false	// default
	recog.lang = 'en-US'
	recog.maxAlternatives = 5
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

	const colorDiv = document.createElement('div')
	colorDiv.classList.add('colors')
	colors.forEach(v => {
		const span = document.createElement('span')
		span.setAttribute('style', 'background-color: ' + v)
		span.textContent = v
		colorDiv.append(span)
	})
	document.body.append(colorDiv)

	// Start and stop voice recognition
	const startRecog = () => {
		console.log(recog)
		recog.start()
		console.log(recog)
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
		const results = ev.results[0]	// there's only 1 item
		let result = '', confidence = -1, hit = false
		for (let i = 0; i < results.length; i++) {	// iterate through alternatives
			const color = results[i].transcript.replace(/\s/g, '').toLowerCase()
			if (confidence < results[i].confidence) {	// best guess if no hit is found
				result = color
				confidence = results[i].confidence
			}
			if (colors.indexOf(color) >= 0) {	// hit
				document.body.style.backgroundColor = color
				result = color
				confidence = results[i].confidence
				hit = true
				break
			}
		}
		status.textContent = 'Ergebnis: ' + result
		status.textContent += ', Verlässlichkeit: ' + confidence
		status.textContent += ', Farbe erkannt: ' + (hit? 'ja' : 'nein')
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