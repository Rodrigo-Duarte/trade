var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen({
        smartCSR: true
     })


var grid = new contrib.grid({rows: 9, cols: 4, screen: screen})

function createLine(line, column, title) {
    return grid.set(line,column,3,4, contrib.line,
         { xLabelPadding: 0 , xPadding: 0 , label: title
         , style: { line: "yellow", text: "green", baseline: "black" } })
}

function createTicker(line, column, title) {
    return grid.set(line, column,1,4, blessed.box, {label: title, content: 'Loading...'})
}

function createBarrierOpts(text) {
    return { label: text, barWidth: 8, barSpacing: 12, xOffset: 0, maxHeight: 0 }
}

function createUpperBarriers(line, column, text) {
    return grid.set(line,column*2,2,2, contrib.bar,createBarrierOpts(text))
}

var dashboard = {
    addTicker: function(line, column, coin) {
        var el = createTicker(line, column, coin)
        screen.append(el)
        return el
    },
    updateTicker: function(tickerP, min, max, last, volume, spread) {
        tickerP.setContent(
`Min: R$ ${min.toFixed(2)}  |  Max: R$ ${max.toFixed(2)}  |  Spread: ${spread.toFixed(4)} %  |  Last: R$ ${last.toFixed(2)}  |  Volume: ${volume}`
        )
    },

    addUpperBarriers: function(line, column, coin) {
        var el = createUpperBarriers(line, column, "Upper barrier " + coin)
        screen.append(el)
        return el
    },
    updateBarriers: function(el, data) { el.setData(data) },

    addLowerBarriers: function(line, column, coin) {
        var el = createUpperBarriers(line, column, "Lower barrier " + coin)
        screen.append(el)
        return el
    },

    addGraph: function(line, column, coin) {
        var el = createLine(line, column, coin)
        screen.append(el)
        return el
    },
    updateGraph: function(el, data) { 
        var prices = data.y.slice().sort()
        el.options.minY = prices[0]*0.99
        el.options.maxY = prices[prices.length-1]*1.01
        el.setData([data]) 
    }
}

module.exports = dashboard

//=====

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
})
setInterval(function(){screen.render()}, 100)