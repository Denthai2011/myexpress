const express = require('express');
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: 'og2fHqgMc0tvD0ev+aQU/JX7dz3wvXLXTVTpQ1S6sBQd/4Dcq3x4z4tvMp5YotStmEZp9C7tYlNCUlu10u9B9adH50O1cc8XuwWDzeIIGG55cH89vVJGc9ZTgLoYd01BWBqpG+DwoxoEmBg1jDA7QAdB04t89/1O/w1cDnyilFU=n',
    channelSecret: '4fa5e9620a076421d03c1110f266e771'
};
const client = new line.Client(config);
//FIREBASE
const firebase = require('firebase');
require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyDoJHVfx2lsp4aU7oSF9zfbIEMf_SRKRUk",
    authDomain: "denrenger-d128b.firebaseapp.com",
    projectId: "denrenger-d128b",
    storageBucket: "denrenger-d128b.appspot.com",
    messagingSenderId: "328915144085",
    appId: "1:328915144085:web:55b2c5164f43ac2d4b3a9c",
    measurementId: "G-L1D818PB0R",
} 
const admin = firebase.initializeApp(firebaseConfig);
const db = admin.firestore();
//WEB

const app = express();
const port = 3000
app.post('/webhook', line.middleware(config), (req, res) => {
    //console.log(req);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    //console.log(event);
    //console.log(event.message);
    //console.log(event.message.text);
    let chat = await db.collection('chats').add(event);
    console.log('Added document with ID: ', chat.id);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });
}


// Respond with Hello World! on the homepage:
app.get('/', function (req, res) {
    res.send('Hello World aheeee!')
})
app.get('/test-firebase', async function (req, res) {
    let data = {
        name: 'Bankkok',
        country: 'Thailand'
    }
    const result = await db.collection('cities').add(data);
    console.log('Added document with ID: ', result.id);
    res.send('Test firebase successfully, check your firestore for a new record !!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.post('/', function (req, res) {
    res.send('Got a POST request')
})
// Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})
// Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})
