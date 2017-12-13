var axios = require('axios')

var instance = axios.create({
  baseURL: 'https://www.mercadobitcoin.net/api/LTC/',
  timeout: 10000,
  headers: {'X-Custom-Header': 'foobar'}
});

function BtcRead() {
  this.listeners = []
  this.interval = 2000
}

module.exports = BtcRead

BtcRead.prototype.registerTickerListener = function (callback) {
  var running = setInterval( getTicker(callback), this.interval)
  this.listeners.push(running)
}

function getTicker(callback) {
  return function() {
    instance.get('/ticker/')
    .then(function (response) {
      callback(response.data.ticker)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

BtcRead.prototype.registerOrderbookListener = function (callback) {
  var running = setInterval( getOrderbook(callback), this.interval)
  this.listeners.push(running)
}

function getOrderbook(callback) {
  return function() {
    instance.get('/orderbook/')
    .then(function (response) {
      callback(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

BtcRead.prototype.registerTradeListener = function (callback) {
  var running = setInterval( getTrades(callback), this.interval)
  this.listeners.push(running)
}

function getTrades(callback) {
  return function() {
    instance.get('/trades/')
    .then(function (response) {
      callback(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
