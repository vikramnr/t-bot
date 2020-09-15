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

const chuckResponse =  (data) => {
  let choppedData = []
  for (let u = 0; u < 50; u++) {
    choppedData.push(data.slice(u, u + 10));
  }
  return choppedData
};

module.exports = { gatherData, chuckResponse };
