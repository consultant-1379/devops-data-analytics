import { AfterViewInit, Component } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';

@Component({
  selector: 'app-build-duration-line-chart',
  templateUrl: './build-duration-line-chart.component.html',
  styleUrls: ['./build-duration-line-chart.component.scss']
})


export class BuildDurationLineChartComponent implements  AfterViewInit {

  chart: unknown = []
  
  ngAfterViewInit(): void {

Chart.defaults.borderColor = 'grey';
Chart.defaults.color = 'grey';
    
    const ctx = document.getElementById('lineChart') as ChartItem;

    const data = {
      labels: ['RedRedRed', 'BlueBlueBlue', 'YellowYellow', 'GreenGreen', 'PurplePurple', 'OrangeOrange', 'RedRedRed', 'BlueBlueBlue'],
      datasets: [
        {
          borderColor: '#a81cbe',
          backgroundColor: 'rgba(208, 159, 211, 0.2)',
          data: [12, 19, 3, 5, 2, 3,12, 19],
          fill: true,
          borderWidth: 2
        },
        
      ],
    };

    const options : any = {
      maintainAspectRatio: false, 
      responsive: true,
      parsing: {
        xAxisKey: 'id',
        yAxisKey: 'nested.value'
      },
      plugins: {
        legend: {
          display: false
        },
      },
      layout: {
        autoPadding: false,
        padding: {
          x: 0,
          y: 0
        },
      },
      elements: {
        point: {
          pointStyle: false
        }
      },
      scales: {
        x: {
          grid:{
            tickLength: 4
          },
         
          ticks: {
            padding: -4
          },
          border:{
            display: true,
          },
        },
        y: {
          grid:{
            drawTicks: false,
          },
          ticks: {
            display: true,
          },
          border:{
            display: true,
          },
          title:{
            display: true,
            text: 'seconds'
          },
        },
      },
    };

    this.chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    });
  }
}
