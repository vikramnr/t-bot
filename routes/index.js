const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const router = express.Router();
const { gatherData, chuckResponse, checkCmd } = require("./middleware");

router.get("/", checkCmd , async (req, res) => {
  let data = req.body.cmdData
  console.log(data)
  const fruits = []
  const onthisResponse = await axios.get('https://www.onthisday.com/')
  const $ = cheerio.load(onthisResponse.data)
  console.log($.html())
  $('.event-list').each(function(i, elem) {
    fruits[i] = $(this).text();
    console.log(elem)
    console.log(i)
  });
  console.log(fruits)
  res.send(fruits)
});

router.post("/new-message", checkCmd ,async (req, res) => {
  const { message } = req.body;
  const data =  req.body.cmdData()
    try {
      let response = await axios.post(
        `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`,
        {
          chat_id: message.chat.id,
          text: data
        }
      );
      console.log(response);
      res.end("ok");
    } catch (err) {
      console.log(err);
      res.end(err);
    }
});

module.exports = router;
