const axios = require("axios");
const moment = require("moment");
const sanitizeHtml = require("sanitize-html");
const date = moment().format("MMMM_DD");

const gatherData = async (req, res, next) => {
  console.log(`https://en.wikipedia.org/w/rest.php/v1/page/${date}`);
  const response = await axios.get(
    `https://en.wikipedia.org/w/rest.php/v1/page/${date}`
  );
  let data = response.data.source.split("Events==");
  data = data[1].split("==Holidays");
  data = data[0].split("*"); //.slice(0,50)
  data = data.map((d) => sanitizeHtml(d));
  const regex = /[[\]]/gi;
  // const regex1 = /[^A-Za-z0-9]/gi
  data = data.map((d) => d.replace(regex, ""));
  req.body.wiki_data = data;
  next();
};

const chuckResponse = async (data, chat_id) => {
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
};

module.exports = { gatherData, chuckResponse };
