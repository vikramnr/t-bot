const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const router = express.Router();
const { checkCmd } = require("./middleware");

router.get("/", checkCmd , async (req, res) => {
  let data = req.body.cmdData
  console.log(data)
  res.send('hello world')
});

router.post("/new-message", checkCmd ,async (req, res) => {
  const { message } = req.body
  console.log(req.body)
  const data =  req.body.cmdData
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
