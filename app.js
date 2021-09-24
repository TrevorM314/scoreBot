const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = parseInt(process.env.PORT) || 3000;

const botId = process.env.BOT_ID;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  //res.send("COMING SOON");
  let scores = fs.readFileSync("./score.json", "utf-8");
  res.send(scores);
});


app.post('/', async (req, res) => {
  let regex;
  let text = req.body.text;
  let data = req.body;
  let commands = {
    hello: /^\/say hello$/,
    add: /^\/add( \d+)?$/,
    scores: /^\/scores$/
  }

  if (!text || !data.sender_id) {
    throw new Error("Text and user_id needed")
  }

  let scores = fs.readFileSync("./score.json", "utf-8");
  scores = JSON.parse(scores);

  if (text.match(commands.hello)) {
    res.send(req.body);
  }

  else if (regex = text.match(commands.add)) {
    let user_id = data.sender_id;
    let name = data.name;
    if (scores[user_id] !== undefined) {
      let scoreIncr = parseInt(regex[1])
      if (scoreIncr) {
        scores[user_id]["score"] += scoreIncr;
      }
      else {
        scores[user_id]["score"] ++;
      }
    } 
    else {
      scores[user_id] = {
        name: name,
        score: 1
      }
    }
    fs.writeFileSync("./score.json", JSON.stringify(scores, null, 2));
    Promise.resolve(answer(name + "---" + scores[user_id]["score"]))
    .then(res.send(name + "---" + scores[user_id]["score"]))
    .catch(err => {throw err});
  }

  else if (text.match(commands.scores)) {
    let response = ""
    Object.keys(scores).forEach(key => {
      response = response + scores[key]["name"] + "---" + scores[key]["score"] + "\n";
    });
    if (response === "") {
      response = "No Scores Available";
    }
    Promise.resolve(answer(response))
    .then(res.send(response))
    .catch(err => {throw err;});
  }

  else {
    res.send("Could not understand");
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;

answer = async function(message) {
  console.log("Sending to groupme");
  return axios.post('https://api.groupme.com/v3/bots/post', 
    {
        bot_id: botId,
        text: message
    }
  )
  .then(() => true)
  .catch(err => {
    throw err;
  })
}