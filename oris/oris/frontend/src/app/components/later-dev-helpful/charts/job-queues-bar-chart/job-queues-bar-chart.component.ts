import { AfterViewInit, Component } from '@angular/core';
import Chart, { ChartItem } from 'chart.js/auto';


@Component({
  selector: 'app-job-queues-bar-chart',
  templateUrl: './job-queues-bar-chart.component.html',
  styleUrls: ['./job-queues-bar-chart.component.scss']
})
export class JobQueuesBarChartComponent implements  AfterViewInit {

  chart: unknown = []
  
  ngAfterViewInit(): void {

Chart.defaults.borderColor = 'grey';
Chart.defaults.color = 'grey';
    
    const ctx = document.getElementById('barChart') as ChartItem;

    const data = {
      labels: ['RedRedRed', 'BlueBlueBlue', 'YellowYellow', 'GreenGreen', 'PurplePurple'],
      datasets: [
        {
          borderColor: '#0debeb',
          backgroundColor: 'rgba(13, 235, 235, 0.2)',
          data: [6, 18, 30, 5, 2],
          fill: true,
          borderWidth: 2
        },
        
      ],
    };

    const options : any = {
      maintainAspectRatio: false, 
      responsive: true,
      barPercentage: 0.9,
      // batThickness: 1,
      categoryPercentage: 1.1,
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
            display: false,
            tickLength: 4
          },
         
          ticks: {
            padding: -4
          },
          border:{
            display: true,
            color: 'rgb(75,192,192)'
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
            display: false,
          },
          title:{
            display: true,
            text: 'seconds'
          },
        },
      },
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }


}
