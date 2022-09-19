require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

const publicVapidKey = "BMBH6hw-MrJHDyYUoA5GW-k4i_uFN9bg-c8tdeM2tUBJ_8KehJfOJWS5QYgkpORgVBfJ5I2OSVoeIaOm4iLHym4";
const privateVapidKey = "2rC52-3Bnx4pfIZuBAQKN4j72QI6LWzuuDLQypOzheM";

webPush.setVapidDetails('mailto:romain.duciel08@gmail.com', publicVapidKey, privateVapidKey);

// Subscribe route

app.post('/subscribe', (req, res) => {
  console.log(req.body);

  // create payload
  const payload = JSON.stringify({
    title: req.body.titre,
    message: req.body.message
  });

  let data = fs.readFileSync("data.json", 'UTF-8');
  data = JSON.parse(data);
  if(data)
  {
    for(let i = 0; i < data.length; i++)
    {
      webPush.sendNotification(data[i], payload)
          .catch(error => console.error(error));
    }
    res.status(201).json(req.body).send("Notification envoyée");
  }
  else {
    res.status(400).send("Pas d'utilisateur inscrit");
  }
});

// saveSubscriber route
app.post('/saveSubscriber', (req, res) => {
  const subscription = req.body;
  let arrayOfValues = new Array();
  let data = fs.readFileSync("data.json", 'UTF-8');
  if(data){
    let result = JSON.parse(data);
    for(let i=0; i < result.length; i++){
      arrayOfValues.push(result[i]);
    }
  }
  arrayOfValues.push(subscription);
  fs.writeFile('data.json', JSON.stringify(arrayOfValues), function(err, result) {
    if(err) console.log('error', err);
  });
  res.status(201);
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/admin.html'));
})

app.set('port', 8080);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
