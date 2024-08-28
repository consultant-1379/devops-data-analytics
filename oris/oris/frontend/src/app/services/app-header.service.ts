import { Injectable } from '@angular/core';
import { TimeRange } from 'src/interface/time-range-filter';


@Injectable({
  providedIn: 'root'
})
export class AppHeaderService {

  timeFormats: TimeRange[] = [
    {value: 'minutes', viewValue: 'Minutes'},
    {value: 'hours', viewValue: 'Hours'},
    {value: 'days', viewValue: 'Days'},
    {value: 'weeks', viewValue: 'Weeks'},
    {value: 'months', viewValue: 'Months'},
    {value: 'years', viewValue: 'Years'},
  ];

  
  frequentTimeRangeSuggestions: TimeRange[] = [
    {value: 'today', viewValue: 'Today'},
    {value: '24-hour', viewValue: 'Last 24 hours'},
    {value: '1-week', viewValue: 'Last 1 week'},
    {value: '4-month', viewValue: 'Last 4 months'},
    {value: '30-minute', viewValue: 'Last 30 minutes'},
    {value: '90-day', viewValue: 'Last 90 days'},
    {value: '1-hour', viewValue: 'Last 1 hour'},
    {value: '1-year', viewValue: 'Last 1 year'},
  ];

}
