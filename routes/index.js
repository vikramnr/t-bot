const express = require('express');
const router = express.Router();
const axios = require('axios')
const { gatherData, chuckResponse } =require('./middleware')


router.get('/', gatherData ,async(req,res) => {
    let data = req.body.wiki_data
    console.log(req.body.wiki_data)
    res.send(data.join('-'))
})


router.post('/new-message', gatherData ,async (req, res) => {
	const { message } = req.body

	if (!message || message.text.toLowerCase().indexOf('hello') < 0) {
        let data = req.body.wiki_data
        for (let u = 0; u < 10; u++) {
			let choppedData = data.slice(u, u + 50);
			try {
			  let response = await axios.post(
				`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`,
				{
				  chat_id: message.chat.id,
				  text: choppedData,
				}
			  );
			  console.log(response);
			  res.end("ok");
			} catch (err) {
			  console.log(err);
			  res.end(err);
			}
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