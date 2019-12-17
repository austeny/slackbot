const d = new Date();
const request = require('request-promise');
const hook = 'TJJTT1PLG/BQX7RCQL9/eeKyJJjKSLmakKaSTeiQS3XV';

// const getData = async function(){
//     const json = await request({
//         url: 'http://www.json-generator.com/api/json/get/cgxEaiOaDC',
//         json: true
//     });
//     //Adding extra () in front of { and end of } so not have to explicitly type 'return' again
//     return json.map(person => ({
//         age: person.age,
//         email: person.email,
//         firstName: person.name.firstName,
//         lastName: person.name.lastName,
//     }));
// };

console.log(getTimeToElevenEleven());

(async function() {
    try {
        // get the data
        // const people = await getData();

        const slackBody = {
            mkdwn: true,
            text: `<!channel> 11:11 check!!!`,
            attachments: [{
                color: 'good',
                text: getTimeToElevenEleven()
            }]
        };

        // post to slack
        const res = await request({
            url: `https://hooks.slack.com/services/${hook}`,
            method: 'POST',
            body: slackBody,
            json: true
        });

        console.log(res);
    } catch(e) {
        console.log("error ", e);
    }
})();

function getTimeToElevenEleven(){
    const missedHours = hours12(d) - 11;
    const missedTime = d.getMinutes() - 11;
    let response;
    console.log(missedHours, " ", missedTime);

    if (missedHours == 0){
        if (missedTime == 0){
            response = `Its 11:11!!! :partyblob:`;
        } else if (missedTime < 30) {
            response = `We missed 11:11 by *${missedTime} minutes*`;
        } else {
            response = `Its 11:11 in *${missedTime} minutes*`;
        }
    } else {
        response = `11:11 is in *${Math.abs(missedHours)} hours*`;
    }
    return response;
};

function hours12(date) { return (date.getHours() + 24) % 12 || 12; }