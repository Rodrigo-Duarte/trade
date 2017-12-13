var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen({
     	smartCSR: true
     })


var grid = new contrib.grid({rows: 6, cols: 4, screen: screen})

var line = grid.set(2,0,2,3, contrib.line,
         { style:
           { line: "yellow"
           , text: "green"
           , baseline: "black"}
         , xLabelPadding: 3
         , xPadding: 5
         , label: 'Title'})
screen.append(line) //must append before setting data 

var ticker = grid.set(1,1,1,1, blessed.box, {text: 'text', content: 'content'})
screen.append(ticker)

var upperBarriers = grid.set(4,2,2,2, contrib.bar, {
	label: 'Upper Barriers'
       , barWidth: 8
       , barSpacing: 12
       , xOffset: 0
       , maxHeight: 0
})
screen.append(upperBarriers)
upperBarriers.setData({
	titles: ['a1', 'a2', 'a3'],
	data: [11,22,33]
})

var lowerBarriers = grid.set(4,0,2,2, contrib.bar, {
	label: 'Lower Barriers'
       , barWidth: 8
       , barSpacing: 12
       , xOffset: 0
       , maxHeight: 0
})
screen.append(lowerBarriers)
lowerBarriers.setData({
	titles: ['a1', 'a2', 'a3'],
	data: [11,22,33]
})


var dashboard = {
	setTicker: function(min, max, last, volume, spread) {
		ticker.setContent(
`Min: R$ ${min.toFixed(2)} Max: R$ ${max.toFixed(2)} 

		Spread: ${spread.toFixed(4)} %

Last: R$ ${last.toFixed(2)} Volume: ${volume}`
			)
	},
	setTrades: function(data) {
		line.setData([data])
	},
	setUpperBarriers: function(data) {
		upperBarriers.setData(data)
	},
	setLowerBarriers: function(data) {
		lowerBarriers.setData(data)
	}
}


module.exports = dashboard

//=====


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
})
setInterval(function(){screen.render()}, 100)
