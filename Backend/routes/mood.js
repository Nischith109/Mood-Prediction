const express = require("express");
const axios = require("axios");
const  Sentiment = require("sentiment");
require("dotenv").config()
const router = express.Router();
const sentiment = new Sentiment();

function detectMood(text) {
    const score = sentiment.analyze(text).score;
    if(score>2){
        return "Happy";
    }
    if(score<-2){
        return "Sad";
    }
    return "relaxed";
}

router.post("/", async (req, res) => {
    const mood = detectMood(req.body.text);
    const API = process.env.API_KEY;
    const query = {
        happy: "happy music",
        sad: "comfort music",
        relaxed: "relaxing music"
    };
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query[mood]}&key=${API}&type=video&maxResults=20`;
    try{
        const response = await axios.get(url);
        res.json(response.data.items);
    }
    catch(error){
        console.log(error.response.data);
        res.status(500).json({error: "Failed to fetch videos"});
    }
});
module.exports = router;