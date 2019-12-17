const request = require('request-promise');

require('dotenv').config();

const { WebClient } = require('@slack/client');
const web = new WebClient(process.env.SLACK_TOKEN);

const giphy = {
    baseURL: "https://api.giphy.com/v1/gifs/",
    apiKey: process.env.GIPHY_API_KEY,
    tag: "party",
    type: "random",
    rating: "pg-13"
};
let giphyURL = encodeURI(
    giphy.baseURL + giphy.type + "?api_key=" + giphy.apiKey + "&tag=" + giphy.tag + "&rating=" + giphy.rating
);

(async() => {
    try{
        let res = await request({
            url: giphyURL,
            method: 'GET',
        });
        res = JSON.parse(res);
	console.log(res);

        await web.chat.postMessage({
            channel: 'DJJT4G8MT',
            text: `Its 11:11 :partyblob: \n${res.data.url}`,
            unfurl_links: true
        })
    }catch(e){
        console.log("error: ", e);
    }
})();

debugger;
