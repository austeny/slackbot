const os = require('os');
const express = require('express');
const app = express();
const schedule = require('node-schedule');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// const request = require('request-promise');
//const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/client');

require('dotenv').config();
app.use(bodyParser.json());


let networkInterfaces = os.networkInterfaces();
//console.log(networkInterfaces);
const ip_addr = networkInterfaces['en0'][1].address;
//console.log(networkInterfaces['en0'][1]);
console.log(ip_addr);

const web = new WebClient(process.env.SLACK_TOKEN);
//const slack_webhook = process.env.SLACK_WEBHOOK;

function AptJob(name, time, text, channel_id){
     this.name = name;
     this.time = time;
     this.text = text;
     this.channel_id = channel_id;
     this.channel_name = channel_name;
}
let jobArray    = [];
let jobObjArray = [];
jobObjArray.push(new AptJob('jobName1', '* * * * *', 'jobText1', 'DJJT4G8MT', 'directmessage'));
jobObjArray.push(new AptJob('jobName2', '* * * * *', 'jobText2', 'DJJT4G8MT', 'directmessage'));
jobObjArray.push(new AptJob('jobName3', '* * * * *', 'jobText3', 'CJCHJU1JM', 'general'));
console.log(jobObjArray);

app.get('/', (req, res) => {
    res.send('landing page')
})

//createJob slash command
//args(job name, CRON date, job response text)
app.post('/createjob', urlencodedParser, (req, res) => {
    console.log(req.body);
    //try to create job with args passed in /createjob
    try{
        let args    = req.body.text.split(', ');
        console.log(req.body.text);
        console.log(args);
        let jobObj = new AptJob(args[0], args[1], args[2], req.body.channel_id, req.body.channel_name);
        let sJob = schedule.scheduleJob(args[0], args[1], () => {
            // web.chat.postMessage({
            //     channel: 'CJCHJU1JM',
            //     text: args[2]
            // })
            console.log('scheduled job');
        })
        //add Job and AptJob objects to jobArray and jobObjArray 
        jobArray.push(sJob);
        jobObjArray.push(jobObj);
        // console.log('jobArray: ', jobArray);
        // console.log('jobObjArray: ', jobObjArray);
        res.json({text: `Created job`});
    }catch(e){
        console.log('error: ', e);
        res.json({text: `error`});
    }
})

//createJob slash command
//args(job name, CRON date, job response text)
app.post('/canceljob', urlencodedParser, (req, res) => {
    // try to create job with args passed in /createjob
    try {
        console.log(req.body.text);
        // get index of name of job
        let jobName = req.body.text;
        let index = jobArray.findIndex((item, i) => {
            return item.name === jobName
        });
        console.log(index);

        //check if index was found, yes cancel and remove job from array, no reply bad search
        if(index >= 0){
            jobArray[index].cancel();
            jobArray.splice(jobArray.indexOf(index));
            res.json({text: `Removed ${jobName} job`});
        }else{
            res.json({text: `${jobName} was not found in list of current jobs`});
        }
    }catch(e){
        res.json({text: `Hit error: ${e}`});
    }
})

app.post('/getjobs', urlencodedParser, (req, res) => {
    console.log(req.body);
    // try to create job with args passed in /createjob
    try {
        let message = '';
        console.log(jobObjArray.length);
        jobObjArray.forEach(e => {
            message = `${message}${e.name} - ${e.time} - ${e.text}\n`;
        })
        res.json({text: message});
    }catch(e){
        res.json({text: `Hit error: ${e}`});
    }
})

app.listen(process.env.NODE_PORT, ip_addr, () => {
    console.log(`Sever on port ${process.env.NODE_PORT}`);
})

//scheduled job will run at 8am on 28th of every month
// let rentJob = schedule.scheduleJob('testJob1', '0 8 28 * *', function(){
//     web.chat.postMessage({
//         channel: 'CJCHJU1JM',
//         text: "Make sure to pay rent"
//     })
// });
// rentJob.cancel();

// let fJob = schedule.scheduleJob('testjob1', '*/7 * * * * *', function(){
//     console.log('fjob');
// });
// let sJob = schedule.scheduleJob('testjob2', '*/5 * * * * *', function(){
//     console.log('sjob');
// });
// testArr.push(fJob);
// testArr.push(sJob);
// schedule.scheduleJob('*/10 * * * * *', async function(){
//     try {
//         const res = await request({
//             url: `https://hooks.slack.com/services/${slack_webhook}`,
//             method: 'POST',
//             body: slackBody,
//             json: true
//         });
//         console.log(res);
//     } catch(e) {
//         console.log(`caught error: ${e}`);
//     }
// });