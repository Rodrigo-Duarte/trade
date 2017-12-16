var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen({
        smartCSR: true
     })


var grid = new contrib.grid({rows: 100, cols: 50, screen: screen})

function createLine(line, column, title) {
    return grid.set(line,column,30,40, contrib.line,
         { xLabelPadding: 0 , xPadding: 0 , label: title
         , style: { line: "yellow", text: "green", baseline: "black" } })
}

function createTicker(line, column, title) {
    return grid.set(line*10, column,10,40, blessed.box, {label: title, content: 'Loading...'})
}

function createUpperBarriers(line, column, text) {
    var width = 13
    return grid.set(line*10,column*width,20,width, contrib.bar,createBarrierOpts(text))
}

function createBarrierOpts(text) {
    return { label: text, barWidth: 12, barSpacing: 10, xOffset: 0, maxHeight: 0 }
}

function createAdvisorBox(line, column, coin) {
    return grid.set(line*10, column*13, 20, 13, blessed.box, {label: 'Advisor ' + coin, content: 'Thinking...'})
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

    addAdvisor: function(line, column, coin) {
        var el = createAdvisorBox(line, column, coin)
        screen.append(el)
        return el
    },
    updateAdvisor: function(el, msg) { el.setContent(msg) },

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