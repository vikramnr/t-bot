const express = require("express");
const router = express.Router();
const axios = require("axios");
const { gatherData, chuckResponse } = require("./middleware");

router.get("/", gatherData, async (req, res) => {
  let data = req.body.wiki_data;
	let choppedData = chuckResponse(data);
//   console.log(choppedData);
//  res.send(choppedData[0].join('*'));
	res.send(choppedData[0].join('***'))
});

router.post("/new-message", gatherData, async (req, res) => {
  const { message } = req.body;

  if (message.text && message.text.toLowerCase().includes("wiki")) {
    let data = req.body.wiki_data;
    let choppedData = chuckResponse(data);
    try {
      let response = await axios.post(
        `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`,
        {
          chat_id: message.chat.id,
          text: choppedData[0].join('***'),
        }
      );
      console.log(response);
      res.end("ok");
    } catch (err) {
      console.log(err);
      res.end(err);
    }
  } else {
    try {
      let response = await axios.post(
        `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`,
        {
          chat_id: message.chat.id,
          text:
            'Hey there. This is wikipedia bot that sends the historical events for today. Type "wiki" for more details on today events',
        }
      );
      console.log(response);
      res.end("ok");
    } catch (err) {
      console.log(err);
      res.end(err);
    }
  }
});

// https://en.wikipedia.org/w/rest.php/v1/page/September_13
//September_14th
module.exports = router;
