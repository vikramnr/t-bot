const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const { getWikiData, getOnThisDay } = require("./middleware");

router.get("/", checkCmd, async (req, res) => {
  let data = req.body.cmdData;
  console.log(data);
  res.send("hello world");
});

router.post("/new-message", async (req, res) => {
  const { message } = req.body;
  const cmdData = 'Hey there!!. This is a bot that sends the historical events for today. For more details use "help"';
  if (message && message.text) {
    const cmd = message.text.toLowerCase();
    if (cmd === "wiki") {
      cmdData = await getWikiData();
    } else if (cmd === "onthisday") {
      cmdData = await getOnThisDay();
    }
    cmdData =
      'Please use "wiki" for data from Wikipedia and "onthisday" for data from other websites';
  }
  try {
    let response = await axios.post(
      `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`,
      {
        chat_id: message.chat.id,
        text: cmdData,
      }
    );
    res.end("ok");
  } catch (err) {
    res.end(err);
  }
});

module.exports = router;
