require("dotenv").config();
var Twitter = require("twitter");
var express = require("express");
var path = require("path");

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
});

const app = express();
const log = console.log;
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

app.get("/", (req, res) => {
    // Render HTML
    res.sendFile(path.join(__dirname, './index.html'));
});

app.post("/twitter/message", async(req, res) => {

    const tweet = req.body.tweet;

    try {
        const response = await postToTwitter(tweet);
        res.json({
            message: 'Tweet successfully posted to twitter'
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Not able to post'
        });
    }

});

function postToTwitter(tweet) {
  client.post(
    "statuses/update",
    { status: tweet },
    function (error, tweet, response) {
      if (error) log('Error occurs while posting to twitter');
      log(tweet); // Tweet body.
    }
  );
}

app.listen(PORT, log('Server is starting at port ', PORT));
