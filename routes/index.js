const express = require('express');
const router = express.Router();
const axios = require('axios')
const moment = require('moment')
const sanitizeHtml = require('sanitize-html');


router.get('/',async(req,res) => {
    const date = moment().format("MMMM_DD")
    console.log(date)
    console.log(`https://en.wikipedia.org/w/rest.php/v1/page/${date}`)
    const response = await axios.get(`https://en.wikipedia.org/w/rest.php/v1/page/${date}`)
    let data = response.data.source.split('Events==')
    data =  data[1].split('*')
    res.send(response.data)
})

router.post('/new-message', async (req, res) => {
	const { message } = req.body

	if (!message || message.text.toLowerCase().indexOf('hello') < 0) {
        const date = moment().format("MMMM_DD")
        const response = await axios.get(`https://en.wikipedia.org/w/rest.php/v1/page/${date}`)
        let data = response.data.source.split('Events==')
        data =  data[1].split('*').slice(0,10)
        data = sanitizeHtml(data)
        console.log(data)
		try {
			let response = await axios.post(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, {
				chat_id: message.chat.id,
				text: data,
			})
			console.log(response)
			res.end('ok')
		} catch (err) {
			console.log(err)
			res.end(err)
		}
	} else {
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
	}
})

 // https://en.wikipedia.org/w/rest.php/v1/page/September_13
 //September_14th
module.exports =  router