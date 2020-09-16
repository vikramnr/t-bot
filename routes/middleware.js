const axios = require("axios");
const moment = require("moment");
const sanitizeHtml = require("sanitize-html");
const cheerio = require('cheerio');
const date = moment().format("MMMM_DD");
const commands = {'wiki':'getWikiData','onthisday':'getOnThisDay','help': 'Please use "wiki" for data from Wikipedia and "onthisday" for data from other websites'}


const checkCmd = async(req,res,next) => {
  const { message } = req.body
  

  if (message) {
    const cmd = message.text.toLowerCase() || 'help'
    req.body.cmdData = commands[cmd]
  } else {
    req.body.cmdData = 'Hey there!!. This is a bot that sends the historical events for today. For more details use "help"'
  }
  next()
}

const getOnThisDay = async () => {
  const events = []
  const onthisResponse = await axios.get('https://www.onthisday.com/')
  const $ = cheerio.load(onthisResponse.data)
  $('.event-list').each(function(i, elem) {
    fruits[i] = $(this).text();
    console.log(elem)
    console.log(i)
  });

  console.log(fruits)
  return fruits
}


const getWikiData = async () => {
  const response = await axios.get(
    `https://en.wikipedia.org/w/rest.php/v1/page/${date}`
  );
  let data = response.data.source.split("Events==");
  data = data[1].split("==Holidays");
  data = data[0].split("*"); //.slice(0,50)
  data = data.map((d) => sanitizeHtml(d));
  const regex = /[[\]]/gi;
  data = data.map((d) => d.replace(regex, ""));
  let choppedData = chuckResponse(data);
  return choppedData[0].join('****')
};

const chuckResponse =  (data) => {
  let choppedData = []
  let dataLen = 0
  for (let u = 0; dataLen <= data.length; u++) {
    dataLen+=20
    choppedData.push(data.slice(u, u + 20));
  }
  return choppedData
};

module.exports = { getWikiData , chuckResponse, checkCmd };