var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen({
        smartCSR: true
     })


var grid = new contrib.grid({rows: 6, cols: 4, screen: screen})

// var line = grid.set(2,0,2,3, contrib.line,
//          { style:
//            { line: "yellow"
//            , text: "green"
//            , baseline: "black"}
//          , xLabelPadding: 3
//          , xPadding: 5
//          , label: 'Title'})
// screen.append(line) //must append before setting data 

function getTicker(line, column, title) {
    var ticker = grid.set(line, column,1,1, blessed.box, {label: title, content: 'Loading...'})
    return ticker
}

function getUpperBarriers(line, column, coin) {
    var upperBarriers = grid.set(line,column*2,2,2, contrib.bar, {
        label: 'Upper Barriers ' + coin
           , barWidth: 8
           , barSpacing: 12
           , xOffset: 0
           , maxHeight: 0
    })
    return upperBarriers
}

function getLowerBarriers(line, column, coin) {
    var lowerBarriers = grid.set(line,column*2,2,2, contrib.bar, {
        label: 'Lower Barriers ' + coin
           , barWidth: 8
           , barSpacing: 12
           , xOffset: 0
           , maxHeight: 0
    })
    return lowerBarriers
}

var dashboard = {
    createTicker: function(line, column, coin) {
        var el = getTicker(line, column, coin)
        screen.append(el)
        return el
    },
    updateTicker: function(tickerP, min, max, last, volume, spread) {
        tickerP.setContent(
`Min: R$ ${min.toFixed(2)} Max: R$ ${max.toFixed(2)} 

        Spread: ${spread.toFixed(4)} %

Last: R$ ${last.toFixed(2)} Volume: ${volume}`
            )
    },

    createUpperBarriers: function(line, column, coin) {
        var el = getUpperBarriers(line, column, coin)
        screen.append(el)
        return el
    },
    updateUpperBarriers: function(el, data) { el.setData(data) },

    createLowerBarriers: function(line, column, coin) {
        var el = getLowerBarriers(line, column, coin)
        screen.append(el)
        return el
    },
    updateLowerBarriers: function(el, data) { el.setData(data) },

    setTrades: function(data) {
        line.setData([data])
    },

}

module.exports = dashboard

//=====


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
})
setInterval(function(){screen.render()}, 100)
