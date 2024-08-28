import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {

  lastRefreshTime = 'dd-mm-yyyy hh:mm';

  ngOnInit(): void {
    this.lastRefreshTime = this.getCurrentDateTime();
  }

  
  refreshData() {
    this.lastRefreshTime = this.getCurrentDateTime();
  }

  getCurrentDateTime() : string{
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  }

}
