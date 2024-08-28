import { AfterViewInit, Component } from '@angular/core';
import Chart, { ChartItem } from 'chart.js/auto';

@Component({
  selector: 'app-task-failures-donut-chart',
  templateUrl: './task-failures-donut-chart.component.html',
  styleUrls: ['./task-failures-donut-chart.component.scss']
})
export class TaskFailuresDonutChartComponent implements  AfterViewInit {

  chart: unknown = []
  
  ngAfterViewInit(): void {

Chart.defaults.borderColor = 'grey';
Chart.defaults.color = 'grey';

const ctx = document.getElementById('donutChart') as ChartItem;

const data = {
  labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
  datasets: [
    {
      label: 'Dataset 1',
      pieceLabel:{
        render: 'label',
        fontColor: 'red',
        segment: true,
        position: 'outside'

      },
      data: [2, 5, 7, 8, 4],
      spacing: 4,
      backgroundColor: [
        "rgba(255, 69, 0, 0.2)",   
        "rgba(255, 165, 0, 0.2)",  
        "rgba(255, 0, 255, 0.2)",  
        "rgba(0, 128, 0, 0.2)",    
        "rgba(0, 0, 255, 0.2)"     
      ],
      
      
      
    }
  ]
};
    
  
   const options : any = {
      maintainAspectRatio: false, 
      responsive: true,
      spacing: 10,
      labels: {
        render: 'label'
      },
      borderColor: [
        "rgba(255, 69, 0, 1)",   
        "rgba(255, 165, 0, 1)",  
        "rgba(255, 0, 255, 1)",  
        "rgba(0, 128, 0, 1)",    
        "rgba(0, 0, 255, 1)"     
      ],
      plugins: {
        legend: {
          display: false
        },
      },
      layout: {
        autoPadding: false,
        padding: 0
      },
      elements: {
        point: {
          pointStyle: false
        }
      },
    };

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  }


}
