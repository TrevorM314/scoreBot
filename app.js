const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
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


app.post('/', (req, res) => {
  let text = req.body.text;
  let data = req.body;
  let commands = {
    hello: /^\/say hello$/,
    add: /^\/add$/,
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

  else if (text.match(commands.add)) {
    let user_id = data.sender_id;
    let name = data.name;
    if (scores[user_id] !== undefined) {
      scores[user_id]["score"] ++;
    } else {
      scores[user_id] = {
        name,
        score: 1
      }
    }
    fs.writeFileSync("./score.json", JSON.stringify(scores, null, 2));
    //answer(name + "---" + scores[user_id]["score"])
    res.send(name + "---" + scores[user_id]["score"]);
  }

  else if (text.match(commands.scores)) {
    let response = ""
    Object.keys(scores).forEach(key => {
      response = response + scores[key]["name"] + "---" + scores[key]["score"] + "\n";
    });
    //answer(response);
    res.send(response);
  }

  else {
    res.send("Could not understand");
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;

answer = function(message) {
  axios.post('https://api.groupme.com/v3/bots/post', 
    {
        bot_id: botId,
        text: message
    }
  )
  .then(response => {
      console.log(response);
  })
}