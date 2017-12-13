var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen({
     	smartCSR: true
     })


var grid = new contrib.grid({rows: 6, cols: 3, screen: screen})

// var line = grid.set(0,0,1,1, contrib.line,
//          { style:
//            { line: "yellow"
//            , text: "green"
//            , baseline: "black"}
//          , xLabelPadding: 3
//          , xPadding: 5
//          , label: 'Title'})

// var data = {
//          x: ['t1', 't2', 't3', 't4'],
//          y: [5, 1, 7, 5]
//       }

// screen.append(line) //must append before setting data 
// line.setData([data])



// var log = grid.set(0,1,1,1,contrib.log,
//       { fg: "green"
//       , selectedFg: "green"
//       , label: 'Stats'})


var buySellSpread = grid.set(0,1,1,1, blessed.box, {text: 'text', content: 'content'})
screen.append(buySellSpread)

var ticker = grid.set(1,1,1,1, blessed.box, {text: 'text', content: 'content'})
screen.append(ticker)


var dashboard = {
	setBuySellSpread: function(buy, sell, spread) {
		buySellSpread.setContent(
`
Buy  for: R$ ${buy.toFixed(2)} 
Sell for: R$ ${sell.toFixed(2)} 
Spread:      ${spread.toFixed(6)} %`
		)
	},
	setTicker: function(min, max, last, volume) {
		ticker.setContent(
`
Min: R$ ${min.toFixed(2)} Max: R$ ${max.toFixed(2)} 
Volume: ${volume}
Last: R$ ${last.toFixed(2)}`
			)
	}
}


module.exports = dashboard

//=====


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
})
setInterval(function(){screen.render()}, 100)
