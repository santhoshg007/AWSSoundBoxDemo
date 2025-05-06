const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON payloads
app.use(bodyParser.json());

// MQTT client setup
const mqttClient = mqtt.connect('mqtt://localhost');

// When connected to MQTT
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

// Webhook endpoint to receive DBS payload
app.post('/dbs/webhook', (req, res) => {
  const payload = req.body;

  console.log('Received webhook from DBS:', JSON.stringify(payload, null, 2));

  mqttClient.publish('dbs/txnResponse', JSON.stringify(payload), {}, (err) => {
    if (err) {
      console.error('Failed to publish to MQTT:', err);
      return res.status(500).send('Failed to publish to MQTT');
    }

    console.log('Published to MQTT topic: dbs/txnResponse');
    res.status(200).send('Webhook received and published');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
