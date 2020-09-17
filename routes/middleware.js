const axios = require("axios");
const moment = require("moment");
const sanitizeHtml = require("sanitize-html");
const cheerio = require('cheerio');
const date = moment().format("MMMM_DD");
const onthis = moment().format('MMMM')
const onthisDate = moment().format('DD')


const checkCmd = async(req,res,next) => {
  const message  = req.body.message
  if (message) {
    const cmd = message.text.toLowerCase()
    console.log(cmd)
    if(cmd === 'wiki') {
      req.body.cmdData = await getWikiData()
    } else if (cmd === 'onthisday') {
      req.body.cmdData = await getOnThisDay()
    } else {
      req.body.cmdData = 'Please use "wiki" for data from Wikipedia and "onthisday" for data from other websites'
    }
  } else {
    req.body.cmdData = 'Hey there!!. This is a bot that sends the historical events for today. For more details use "help"'
    
  }
  next()
}

const getOnThisDay = async () => {
  const events = []
  // `https://www.onthisday.com/day/${onthis}/${onthisDate}`
  const onthisResponse = await axios.get(`https://www.onthisday.com/day/${onthis}/${onthisDate}`)
  const $ = cheerio.load(onthisResponse.data)
  $('.event-list--with-advert').each(function(i, elem) {
    events[i] = $(this).text();
  });
  return events.join('***')
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
  // let choppedData = chuckResponse(data);
  // choppedData = choppedData[10]
  // let choppedData1 = choppedData[11]
  return data.slice(0,30).join('****')
};

const chuckResponse =  (data) => {
  let choppedData = []
  let dataLen = 0
  for (let u = 0; dataLen <= data.length; u++) {
    dataLen+=40
    choppedData.push(data.slice(u, u + 40));
  }
  return choppedData
};

module.exports = { getWikiData , chuckResponse, checkCmd, getOnThisDay };
