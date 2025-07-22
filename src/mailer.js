

export default {
    sendNewUserLink: (mobile,password) => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);
        client.messages
          .create({
             body: 'Your RRoom verification code is  '+ password,
             from: '+15157173436',
             to: '+918543070552'
           })
          .then(message => console.log(message.sid))
          .catch(e=>{
            console.log(e);
          })
    },

}