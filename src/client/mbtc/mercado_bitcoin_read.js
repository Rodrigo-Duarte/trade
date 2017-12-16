var axios = require('axios')

function BtcRead(coin) {
  this.listeners = []
  this.interval = 2000
  this.instance = axios.create({
    baseURL: 'https://www.mercadobitcoin.net/api/' + coin,
    timeout: 10000,
    headers: {'X-Custom-Header': 'foobar'}
  });
}

module.exports = BtcRead

BtcRead.prototype.registerTickerListener = function (callback) {
  var running = setInterval( this.getTicker(callback), this.interval)
  this.listeners.push(running)
}



BtcRead.prototype.registerOrderbookListener = function (callback) {
  var running = setInterval( this.getOrderbook(callback), this.interval)
  this.listeners.push(running)
}



BtcRead.prototype.registerTradeListener = function (callback) {
  var running = setInterval( this.getTrades(callback), this.interval)
  this.listeners.push(running)
}

BtcRead.prototype.getTrades = function(callback) {
  var self = this
  return function() {
    self.instance.get('/trades/')
    .then(function (response) {
      callback(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

BtcRead.prototype.getOrderbook = function(callback) {
  var self = this
  return function() {
    self.instance.get('/orderbook/')
    .then(function (response) {
      callback(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
BtcRead.prototype.getTicker = function (callback) {
  var self = this
  return function() {
    self.instance.get('/ticker/')
    .then(function (response) {
      callback(response.data.ticker)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
