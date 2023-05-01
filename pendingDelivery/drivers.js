'use strict'

const {Consumer} = require('sqs-consumer');
const {Producer} = require('sqs-producer');
const Chance = require('chance');
const chance = new Chance();


const app = Consumer.create({
  region: 'us-west-2',
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/172466436984/pendingDelivery.fifo',
  handleMessage: (message) => {setInterval(() => {
    let msg = JSON.parse(message.Body);

    let orderInfo = JSON.parse(msg.Message)

    const producer = Producer.create({
      region: 'us-west-2',
      queueUrl: orderInfo.vendorUrl,
    });
    
    
      producer.send({
        id: chance.guid(),
        body: `Successfully delivered package #${orderInfo.orderId} to ${orderInfo.customer}.`
      }).then(response => {
        console.log('Successfully notified vendor of delivered package', response);
      }).catch(error => {
        console.log('Error delivering vendor package', error)
      })
    }, chance.integer({min: 3000, max: 7000}))

  }
})

app.start();