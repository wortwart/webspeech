// Inspired (ahem) by https://github.com/mdn/web-speech-api/blob/master/speech-color-changer/script.js

;+function() {
	'use strict'
	if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))
		return alert('Keine Spracherkennung!')

	const languages = ['de-DE', 'en-US']
	let currentLanguage = 'de'

	const colors = {
		aliceblue: {
			de: 'Alice-blau',
			en: 'alice blue'
		},
		antiquewhite: {
			de: 'antik-weiß',
			en: 'antique white'
		},
		aqua: {
			de: 'Aqua',
			en: 'aqua'
		},
		aquamarine: {
			de: 'Aquamarin',
			en: 'aquamarine'
		},
		azure: {
			de: 'azurblau',
			en: 'azure'
		},
		beige: {
			de: 'beige',
			en: 'beige'
		},
		bisque: {
			de: 'Biskuit',
			en: 'bisque'
		},
		black: {
			de: 'schwarz',
			en: 'black'
		},
		blanchedalmond: {
			de: 'blanchierte Mandel',
			en: 'blanched almond'
		},
		blue: {
			de: 'blau',
			en: 'blue'
		},
		blueviolet: {
			de: 'blauviolett',
			en: 'blue violet'
		},
		brown: {
			de: 'braun',
			en: 'brown'
		},
		burlywood: {
			de: 'Wurzelholz',
			en: 'burlywood'
		},
		cadetblue: {
			de: 'kadettenblau',
			en: 'cadet blue'
		},
		chartreuse: {
			de: 'Chartreuse',
			en: 'chartreuse'
		},
		chocolate: {
			de: 'Schokolade',
			en: 'chocolate'
		},
		coral: {
			de: 'korallenrot',
			en: 'coral'
		},
		cornflowerblue: {
			de: 'Kornblumenblau',
			en: 'cornflower blue'
		},
		cornsilk: {
			de: 'Kornblumenseide',
			en: 'cornsilk'
		},
		crimson: {
			de: 'karminrot',
			en: 'crimson'
		},
		darkblue: {
			de: 'dunkelblau',
			en: 'dark blue'
		},
		darkcyan: {
			de: 'dunkelcyan',
			en: 'dark cyan'
		},
		darkgoldenrod: {
			de: 'dunkle Goldrute',
			en: 'dark golden rod'
		},
		darkgray: {
			de: 'dunkelgrau',
			en: 'dark gray'
		},
		darkgreen: {
			de: 'dunkelgrün',
			en: 'dark green'
		},
		darkkhaki: {
			de: 'dunkelhaki',
			en: 'dark khaki'
		},
		darkmagenta: {
			de: 'dunkelmagenta',
			en: 'dark magenta'
		},
		darkolivegreen: {
			de: 'dunkelolivgrün',
			en: 'dark olive green'
		},
		darkorange: {
			de: 'dunkelorange',
			en: 'dark orange'
		},
		darkorchid: {
			de: 'dunkle Orchidee',
			en: 'dark orchid'
		},
		darkred: {
			de: 'dunkelrot',
			en: 'darkred'
		},
		darksalmon: {
			de: 'dunkles Lachsrosa',
			en: 'dark salmon'
		},
		darkseagreen: {
			de: 'dunkelseegrün',
			en: 'dark seagreen'
		},
		darkslateblue: {
			de: 'dunkles Schieferblau',
			en: 'dark slateblue'
		},
		darkslategray: {
			de: 'dunkles Schiefergrau',
			en: 'dark slategray'
		},
		darkturquoise: {
			de: 'dunkeltürkis',
			en: 'dark turquoise'
		},
		darkviolet: {
			de: 'dunkelviolett',
			en: 'dark violet'
		},
		deeppink: {
			de: 'tiefes Pink',
			en: 'deep pink'
		},
		deepskyblue: {
			de: 'tiefes Himmelblau',
			en: 'deep skyblue'
		},
		dimgray: {
			de: 'schwachgrau',
			en: 'dim gray'
		},
		dodgerblue: {
			de: 'Dodger-blau',
			en: 'dodger blue'
		},
		firebrick: {
			de: 'Schamottstein',
			en: 'firebrick'
		},
		floralwhite: {
			de: 'blütenweiß',
			en: 'floral white'
		},
		forestgreen: {
			de: 'waldgrün',
			en: 'forest green'
		},
		fuchsia: {
			de: 'Fuchsia',
			en: 'fuchsia'
		},
		gainsboro: {
			de: 'Gainsboro',
			en: 'gainsboro'
		},
		ghostwhite: {
			de: 'geisterweiß',
			en: 'ghostwhite'
		},
		gold: {
			de: 'golden',
			en: 'gold'
		},
		goldenrod: {
			de: 'Goldrute',
			en: 'golden rod'
		},
		gray: {
			de: 'grau',
			en: 'gray'
		},
		green: {
			de: 'grün',
			en: 'green'
		},
		greenyellow: {
			de: 'grüngelb',
			en: 'green yellow'
		},
		honeydew: {
			de: 'Honigtau',
			en: 'honeydew'
		},
		hotpink: {
			de: 'heißes Pink',
			en: 'hotpink'
		},
		indianred: {
			de: 'indisch-rot',
			en: 'indianred'
		},
		indigo: {
			de: 'Indigo',
			en: 'indigo'
		},
		ivory: {
			de: 'Elfenbein',
			en: 'ivory'
		},
		khaki: {
			de: 'khaki',
			en: 'khaki'
		},
		lavender: {
			de: 'Lavendel',
			en: 'lavender'
		},
		lavenderblush: {
			de: 'Lavendelblüte',
			en: 'lavender blush'
		},
		lawngreen: {
			de: 'grasgrün',
			en: 'lawngreen'
		},
		lemonchiffon: {
			de: 'Hadern-Zitrone',
			en: 'lemon chiffon'
		},
		lightblue: {
			de: 'hellblau',
			en: 'light blue'
		},
		lightcoral: {
			de: 'helles Korallenrot',
			en: 'light coral'
		},
		lightcyan: {
			de: 'helles Cyan',
			en: 'light cyan'
		},
		lightgoldenrodyellow: {
			de: 'helles Goldrutengelb',
			en: 'light golden rod yellow'
		},
		lightgray: {
			de: 'hellgrau',
			en: 'light gray'
		},
		lightgreen: {
			de: 'hellgrün',
			en: 'light green'
		},
		lightpink: {
			de: 'hellrosa',
			en: 'light pink'
		},
		lightsalmon: {
			de: 'helles Lachsrosa',
			en: 'light salmon'
		},
		lightseagreen: {
			de: 'helles Seegrün',
			en: 'light seagreen'
		},
		lightskyblue: {
			de: 'hellblau',
			en: 'light skyblue'
		},
		lightslategray: {
			de: 'helles Schiefergrau',
			en: 'light slategray'
		},
		lightsteelblue: {
			de: 'helles Stahlblau',
			en: 'light steelblue'
		},
		lightyellow: {
			de: 'hellgelb',
			en: 'light yellow'
		},
		lime: {
			de: 'Limone',
			en: 'lime'
		},
		limegreen: {
			de: 'limettengrün',
			en: 'limegreen'
		},
		linen: {
			de: 'Leinen',
			en: 'linen'
		},
		maroon: {
			de: 'kastanienbraun',
			en: 'maroon'
		},
		mediumaquamarine: {
			de: 'mittel-aquamarin',
			en: 'medium aquamarine'
		},
		mediumblue: {
			de: 'mittelblau',
			en: 'medium blue'
		},
		mediumorchid: {
			de: 'mittel-Orchidee',
			en: 'medium orchid'
		},
		mediumpurple: {
			de: 'mittelviolett',
			en: 'medium purple'
		},
		mediumseagreen: {
			de: 'mittel-seegrün',
			en: 'medium seagreen'
		},
		mediumslateblue: {
			de: 'mittel-schieferblau',
			en: 'medium slateblue'
		},
		mediumspringgreen: {
			de: 'mittel-frühlingsgrün',
			en: 'medium spring green'
		},
		mediumturquoise: {
			de: 'mitteltürkis',
			en: 'medium turquoise'
		},
		mediumvioletred: {
			de: 'mittelviolettrot',
			en: 'medium violet red'
		},
		midnightblue: {
			de: 'mitternachtsblau',
			en: 'midnight blue'
		},
		mintcream: {
			de: 'Minzcreme',
			en: 'mint cream'
		},
		mistyrose: {
			de: 'Nebelrose',
			en: 'misty rose'
		},
		moccasin: {
			de: 'Mokassin',
			en: 'moccasin'
		},
		navajowhite: {
			de: 'navajo-weiß',
			en: 'navajo white'
		},
		navy: {
			de: 'marineblau',
			en: 'navy'
		},
		oldlace: {
			de: 'alte Spitze',
			en: 'old lace'
		},
		olive: {
			de: 'oliv',
			en: 'olive'
		},
		olivedrab: {
			de: 'olivgrün',
			en: 'olive drab'
		},
		orange: {
			de: 'orange',
			en: 'orange'
		},
		orangered: {
			de: 'orange-rot',
			en: 'orange red'
		},
		orchid: {
			de: 'Orchidee',
			en: 'orchid'
		},
		palegoldenrod: {
			de: 'blasse Goldrute',
			en: 'pale golden rod'
		},
		palegreen: {
			de: 'blassgrün',
			en: 'pale green'
		},
		paleturquoise: {
			de: 'blasstürkis',
			en: 'pale turquoise'
		},
		palevioletred: {
			de: 'blasses Violettrot',
			en: 'pale violet red'
		},
		papayawhip: {
			de: 'Papaya-gerte',
			en: 'papaya whip'
		},
		peachpuff: {
			de: 'Pfirsichkuchen',
			en: 'peach puff'
		},
		peru: {
			de: 'Peru',
			en: 'peru'
		},
		pink: {
			de: 'rosa',
			en: 'pink'
		},
		plum: {
			de: 'Pflaume',
			en: 'plum'
		},
		powderblue: {
			de: 'puderblau',
			en: 'powder blue'
		},
		purple: {
			de: 'violett',
			en: 'purple'
		},
		rebeccapurple: {
			de: 'Rebecca-violett',
			en: 'rebecca purple'
		},
		red: {
			de: 'rot',
			en: 'red'
		},
		rosybrown: {
			de: 'rosabraun',
			en: 'rosy brown'
		},
		royalblue: {
			de: 'königsblau',
			en: 'royal blue'
		},
		saddlebrown: {
			de: 'sattelbraun',
			en: 'saddle brown'
		},
		salmon: {
			de: 'lachsrosa',
			en: 'salmon'
		},
		sandybrown: {
			de: 'sandbraun',
			en: 'sandy brown'
		},
		seagreen: {
			de: 'seegrün',
			en: 'seagreen'
		},
		seashell: {
			de: 'Muschel',
			en: 'seashell'
		},
		sienna: {
			de: 'siena',
			en: 'sienna'
		},
		silver: {
			de: 'Silber',
			en: 'silver'
		},
		skyblue: {
			de: 'himmelblau',
			en: 'skyblue'
		},
		slateblue: {
			de: 'schieferblau',
			en: 'slate blue'
		},
		slategray: {
			de: 'schiefergrau',
			en: 'slate gray'
		},
		snow: {
			de: 'Schnee',
			en: 'snow'
		},
		springgreen: {
			de: 'frühlingsgrün',
			en: 'spring green'
		},
		steelblue: {
			de: 'stahlblau',
			en: 'steelblue'
		},
		tan: {
			de: 'hellbraun',
			en: 'tan'
		},
		teal: {
			de: 'blaugrün',
			en: 'teal'
		},
		thistle: {
			de: 'Distel',
			en: 'thistle'
		},
		tomato: {
			de: 'Tomate',
			en: 'tomato'
		},
		turquoise: {
			de: 'türkis',
			en: 'turquoise'
		},
		violet: {
			de: 'violett',
			en: 'violet'
		},
		wheat: {
			de: 'Weizen',
			en: 'wheat'
		},
		white: {
			de: 'weiß',
			en: 'white'
		},
		whitesmoke: {
			de: 'weißer Rauch',
			en: 'white smoke'
		},
		yellow: {
			de: 'gelb',
			en: 'yellow'
		},
		yellowgreen: {
			de: 'gelbgrün',
			en: 'yellow green'
		}
	}

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
	recog.lang = currentLanguage
	recog.maxAlternatives = 5
	let recording = false

	const colorMap = {}

	// UI elements

	const radioButtons = []

	const colorDiv = document.createElement('div')
	colorDiv.classList.add('colors')

	const insertColors = () => {
		for (let key in colorMap)
			delete colorMap[key]
		Object.keys(colors).forEach(v => {
			const color = colors[v][currentLanguage]
			const span = document.createElement('span')
			span.setAttribute('style', 'background-color: ' + v)
			span.setAttribute('title', color)
			span.textContent = color
			colorDiv.append(span)
			const colName = colors[v][currentLanguage].toLowerCase().replace(/[\s-]/g, '')
			colorMap[colName] = v
		})
	}

	const setLanguage = () => {
		for (let i = 0; i < radioButtons.length; i++) {
			if (radioButtons[i].checked) {
				currentLanguage = radioButtons[i].value.substring(0, 2)
				recog.lang = currentLanguage
				while (colorDiv.firstChild)
					colorDiv.removeChild(colorDiv.firstChild)
				insertColors()
				break
			}
		}
	}

	languages.forEach(lang => {
		const label = document.createElement('label')
		const radio = document.createElement('input')
		radio.setAttribute('type', 'radio')
		radio.setAttribute('name', 'language')
		radio.setAttribute('value', lang)
		if (lang.indexOf(currentLanguage) === 0)
			radio.setAttribute('checked', true)
		radio.addEventListener('change', setLanguage)
		radioButtons.push(radio)
		label.appendChild(radio)
		label.appendChild(document.createTextNode(lang))
		document.body.appendChild(label)
		setLanguage()
	})

	const btn = document.createElement('button')
	btn.setAttribute('autofocus', true)
	btn.textContent = startText
	document.body.append(btn)

	const status = document.createElement('p')
	status.classList.add('status')
	status.textContent = ''
	document.body.append(status)

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
			if (colorMap[color]) {	// hit
				document.body.style.backgroundColor = colorMap[color]
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