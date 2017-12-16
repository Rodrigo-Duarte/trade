function drawBarrier(id, input) {
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


function drawLine(id, input) {
    var data = google.visualization.arrayToDataTable([
          ['Time', 'Sales', 'Expenses'],
          ['2004',  null,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ]);

    var view = new google.visualization.DataView(data);
    var options = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('LowerBarriersGraph'));

        chart.draw(data, options);

}