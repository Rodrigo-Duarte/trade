var axios = require('axios')
var crypto = require('crypto')
var logger = require('./log.js')

const path = '/tapi/v3/'
const url = 'https://www.mercadobitcoin.net/'

function BtcAccount(id, secret) {
  this.id = id
  this.secret = secret
  this.instance = axios.create({
    baseURL: url, method: 'POST', timeout: 10000,
    headers: { 'Content-type': 'application/x-www-form-urlencoded', 'TAPI-ID': id }
  });
}

BtcAccount.prototype.getTapiData = function(action, params) {
  var tapi_nonce = Math.round(new Date().getTime())
  var data = urlencode(params) + 'tapi_method=' + action + '&tapi_nonce=' + tapi_nonce
  var fullPath = path + '?' + data
  return { 'TAPI-MAC': encrypt(fullPath, this.secret), 'data': data }
}

BtcAccount.prototype.getOrders = function(coin, callback) {
  var data = this.getTapiData("list_orders", { coin_pair: coin })
  treatResponse(
    this.instance.post(path, data["data"], { headers: { 'TAPI-MAC': data["TAPI-MAC"] } } )
    , callback)
}

BtcAccount.prototype.placeSellOrder = function(coin, qty, price, callback) {
  var data = this.getTapiData("place_sell_order", { coin_pair: coin, quantity: qty, limit_price: price })
  treatResponse(
    this.instance.post(path, data["data"], { headers: { 'TAPI-MAC': data["TAPI-MAC"] } } )
    , callback)
}

function urlencode(params) {
    return Object.keys(params).reduce((encoded, key) => 
        encoded + encodeURIComponent(key)+"="+encodeURIComponent(params[key])+"&", '')
}

function encrypt(fullPath, secret) {
  return crypto.createHmac('sha512', secret).update(fullPath).digest('hex');
}

function treatResponse(request, callback) {
    request
        .then(function (response) { callback(response.data) })
        .catch(function (error) { logger.error(error); });
}

module.exports = BtcAccount