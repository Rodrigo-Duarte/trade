function drawBarrier(id, input) {
        input.unshift(['Price', 'Volume'])

        var data = google.visualization.arrayToDataTable(input);
        
        view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" }]);

         options = {'title': id, 'width':400, 'height':300};

        chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(view, options);
        
      }