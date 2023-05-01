'use strict';

const Chance = require('chance');
const chance = new Chance();
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const sns = new AWS.SNS();
const topicARN = 'arn:aws:sns:us-west-2:172466436984:vendorPickup.fifo';

const payload = {
  Message: JSON.stringify({
    default: JSON.stringify({
      orderId: chance.guid(),
      customer: chance.name(),
      vendorUrl: 'https://sqs.us-west-2.amazonaws.com/172466436984/vendorReceipts'
    })
  }),
  MessageGroupId: 'vendor1',
  MessageDeduplicationId: chance.guid(),
  MessageStructure: 'json',
  TopicArn: topicARN
}

setInterval(() => {
  sns.publish(payload).promise()
  .then(response => {
    console.log(`VENDOR HAS PACKAGE READY FOR PICKUP`, response)
  })
  .catch(error => {
    console.log('VENDOR RAN INTO ERROR MAKING REQUEST FOR PACKAGE PICKUP', error)
  })  
}, 5000)