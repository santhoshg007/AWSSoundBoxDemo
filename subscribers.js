const mqtt = require('mqtt');

// Connect to local MQTT broker
const mqttClient = mqtt.connect('mqtt://localhost');

mqttClient.on('connect', () => {
  console.log('Subscriber connected to MQTT broker');

  // Subscribe to the DBS webhook topic
  mqttClient.subscribe('dbs/txnResponse', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topic: dbs/txnResponse');
    }
  });
});

// Handle incoming messages
mqttClient.on('message', (topic, message) => {
  console.log(`Message received on topic "${topic}":`);
  try {
    const parsedMessage = JSON.parse(message.toString());
    console.dir(parsedMessage, { depth: null });
  } catch (e) {
    console.error('Failed to parse message:', e);
  }
});
