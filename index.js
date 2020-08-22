const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/new-message', async (req, res) => {
	const { message } = req.body

	if (!message || message.text.toLowerCase().indexOf('hello') < 0) {
		try {
			let response = await axios.post(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, {
				chat_id: message.chat.id,
				text: `Oops I didn't catch that. Could you repeat again`,
			})
			console.log(response)
			res.end('ok')
		} catch (err) {
			console.log(err)
			res.end(err)
		}
	}
	try {
		let response = await axios.post(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, {
			chat_id: message.chat.id,
			text: 'Hey there',
		})
		console.log(response)
		res.end('ok')
	} catch (err) {
		console.log(err)
		res.end(err)
	}
})

app.listen(process.env.PORT || 3000, () => {
	console.log('server started at port 3000')
})
