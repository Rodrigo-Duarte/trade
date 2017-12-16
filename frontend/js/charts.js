function drawBarrier(id, inputP) {
    var input = inputP.map(el => [Number.parseFloat(el[0]), Number.parseFloat(el[1])])
    input.unshift(['Price', 'Volume'])

    var data = google.visualization.arrayToDataTable(input);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                   { calc: "stringify",
                     sourceColumn: 1,
                     type: "string",
                     role: "annotation"
                      }]);

     options = {    'title': id, 'width':400, 'height':300,
                    bar: {groupWidth: "95%"},
                    legend: {position:"none"}};

    var chart = new google.visualization.ColumnChart(document.getElementById(id));
    chart.draw(view, options);
}

function createTracker() {
    return {
        data: {},
        push: function(data, timestamp) {
            this.data[timestamp] = data
            if (Object.keys(this.data).length > 720)
                delete this.data[Object.keys(this.data)[0]]
        }
    }
}


function drawLine(id, input) {
    data = new google.visualization.DataTable()
    data.addColumn("string", 'Time')
    for (var key in input) {
        for (var i = 0; i < input[key].length; i++)
            if (data.getColumnIndex(input[key][i][0]) < 0) 
                data.addColumn("number", input[key][i][0])
        
        var row = new Array(data.getNumberOfColumns())
        
        row[0] = key
        
        for (var i = 0; i < input[key].length; i++)
            row[data.getColumnIndex(input[key][i][0])] = Number.parseFloat(input[key][i][1])

        data.addRow(row)
    }

    view = new google.visualization.DataView(data);
    options = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

    chart = new google.visualization.LineChart(document.getElementById('LowerBarriersGraph'));

    chart.draw(data, options);

}