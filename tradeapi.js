var axios = require('axios')
var crypto = require('crypto')
const path = '/tapi/v3/'

function BtcAccount(id, secret) {
  this.id = id
  this.secret = secret
  this.instance = axios.create({
    baseURL: 'https://www.mercadobitcoin.net/tapi/v3/', method: 'POST', timeout: 10000,
    headers: { 'Content-type': 'application/x-www-form-urlencoded', 'TAPI-ID': id }
  });
}

BtcAccount.prototype.getTapiData = function(action, coin) {
  var tapi_nonce = Math.round(new Date().getTime())
  var data = 'tapi_method=' + action + '&tapi_nonce=' + tapi_nonce + '&coin_pair=' + coin
  var fullPath = path + '?' + data
  return { 'TAPI-MAC': encrypt(fullPath, this.secret), 'data': data }
}

BtcAccount.prototype.getOrders = function(action, coin, callback) {
  var data = this.getTapiData(action, coin)
  this.instance.post('https://www.mercadobitcoin.net/tapi/v3/', data["data"], { headers: { 'TAPI-MAC': data["TAPI-MAC"] } } )
  .then(function (response) {
    console.log(response.data)
  })
  .catch(function (error) {
    console.log(error);
  });
}

function encrypt(fullPath, secret) {
  return crypto.createHmac('sha512', secret).update(fullPath).digest('hex');
}

module.exports = BtcAccount

new BtcAccount('','').getOrders("list_orders", "BRLBTC")