const express = require('express')
const chalk = require('chalk');
const athenticate = require('./middleware/authenticator');
const validate = require('./middleware/validator');
const chatBot = require('./modules/chat-bot');
const dataRepo = require('./modules/data-repository');
const client = require('./modules/micro-controller-client');
const app = express()

app.use(athenticate);
app.use(validate);

// updates the state of the item using a chat bots
app.post('/text-processor', function(req, res) {
    var responce  = chatBot.getResponce(req.body.response); //numeric responce 1 or 0

    client.updateState(responce);
    //perhaps verify that state has been updated
    dataRepo.save(client.getState());

    res.status(200).send("Request has been saved and processed");
})

//updates the state of the item using amazon alexa
app.post('/voice-processor', function(req, res) {
    client.updateState(req.body.response);
    //perhaps verify that state has been updated
    dataRepo.save(client.getState()); //check before if 1 or 0

    res.status(200).send("Request has been saved and processed");
})

//Window state was deleted because the responsibility was given to a seperate app
//that will update the db every 10 min based on the call client.getState()

app.listen(3000, function() {
    console.info(chalk.magenta('------------------s---------------------'));
    console.log(chalk.cyan(' SmartHome API listening on port: 3000'));
    console.info(chalk.magenta('---------------------------------------'));

})
