const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// SETUP SLACK API
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/client');

//SET PORT AND GET ENV VARIABLES
const port = 8080;
require('dotenv').config();

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.SLACK_TOKEN);
app.use('/events', slackEvents.requestListener());

(async ()=> {
    
    
})();

app.use(bodyParser.json());

app.post('/botstatus', urlencodedParser, (req, res) => {
    console.log(req.body);
    (async () => {
        let user_info = await web.users.info({
            user: req.body.user_id
        });
        let real_name = user_info.user.real_name;
        console.log(real_name); 

        let users = await web.users.list();
        console.log(users);
    
    // let real_name = getUser(req.body.user_id);
    // console.log(`after func ${real_name}`);

    let message = { text: `I love caroline! \n -${real_name}`};
    res.json(message);
    })();
})

slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
    console.log(event);
    // if(event.user_id == "UJ7ECSSPM"){
    // if(!event.bot_id){
        web.chat.postMessage({
            channel: event.channel,
            text: ""
        })
    }
});

app.listen(port, process.env.IP, () => {
    console.log(`Sever on port ${port}`);
})
