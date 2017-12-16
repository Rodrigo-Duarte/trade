var orderType = {
    "1": "Buy",
    "2": "Sell"
}

var status = {
    "2": "Open",
    "3": "Canceled",
    "4": "Done"
}

function OrderParser() {
}

OrderParser.prototype.parse = function(data) {
    return data["response_data"]["orders"].map(parseOrder)
}

function parseOrder(order) {
    return {
        coin_pair: order["coin_pair"],
        status: status[order["status"]],
        type: orderType[order["order_type"]],
        quantity: order["quantity"],
        price_limit: order["limit_price"],
        price_executed: order["executed_price_avg"],
        fee: order["fee"]
    }
}

module.exports = OrderParser