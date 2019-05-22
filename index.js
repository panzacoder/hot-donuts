//index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');


const REQUESTS_TABLE = process.env.REQUESTS_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Get Request endpoint
app.get('/requests/:requestId', function (req, res) {
  const params = {
    TableName: REQUESTS_TABLE,
    Key: {
      requestId: req.params.requestId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get request' });
    }
    if (result.Item) {
      const {requestId, name} = result.Item;
      res.json({ requestId, name });
    } else {
      res.status(404).json({ error: "Request not found" });
    }
  });
})

// Create Request endpoint
app.post('/requests', function (req, res) {
  const { requestId, name } = req.body;
  if (typeof requestId !== 'string') {
    res.status(400).json({ error: '"requestId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: REQUESTS_TABLE,
    Item: {
      requestId: requestId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create request' });
    }
    res.json({ requestId, name });
  });
})


module.exports.handler = serverless(app);
