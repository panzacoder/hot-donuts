//index.js

'use strict';

const Alexa = require('ask-sdk-core');
const https = require('request');
const uuidv4 = require('uuid/v4');

const HOTDONUT_API_KEY = process.env.HOTDONUT_API_KEY;
const SKILL_NAME = 'Hot Donuts';
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');



function locationGet (lat, long) {
  return new Promise (function (resolve, reject) {
    let locations = 'Local donut shops.';
    let uuid = uuidv4();
    uuid = uuid.replace('-','');
    let url = "https://services.krispykreme.com/api/locationsearchresult/?callback=jQuery"+uuid+"&responseType=Full&search=%7B%22Where%22%3A%7B%22LocationTypes%22%3A%5B%22Store%22%2C%22Franchise%22%5D%2C%22OpeningDate%22%3A%7B%22ComparisonType%22%3A0%7D%2C%22HasGrubHub%22%3A0%2C%22HasUberEats%22%3A0%2C%22HasAdvancedOrdering%22%3A0%2C%22HasMobileOrdering%22%3A0%2C%22HasDriveThru%22%3A0%7D%2C%22Take%22%3A%7B%22Min%22%3A3%2C%22DistanceRadius%22%3A100%7D%2C%22PropertyFilters%22%3A%7B%22Attributes%22%3A%5B%22OpeningType%22%5D%7D%7D&lat="+lat+"&lng="+long
    https (url, options, (err, res, body) => {
      if (err) {
        console.log ("Error retrieving donuts.");
        reject (new Error ("Error retrieving donuts."));
      }
      console.log (body.url);
      console.log (body);

      
    })
  })
}


module.exports.handler = serverless(app);
