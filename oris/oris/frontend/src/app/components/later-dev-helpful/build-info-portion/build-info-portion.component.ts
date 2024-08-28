import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridParent } from 'src/interface/grids-parent';


@Component({
  selector: 'app-build-info-portion',
  templateUrl: './build-info-portion.component.html',
  styleUrls: ['./build-info-portion.component.scss']
})
export class BuildInfoPortionComponent implements OnInit {

  @Input() inputs !: GridParent;

  dataSub = new BehaviorSubject<GridParent|undefined>(undefined);
  datas$ = this.dataSub.asObservable();

  ngOnInit(): void {
    this.dataSub.next(this.inputs);
  }















        // /** Based on the screen size, switch from standard to one column per row */
        // cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        //   map(({ matches }) => {
        //     if (matches) {
        //       return [
        //         { title: 'Card 1', cols: 1, rows: 1 },
        //         { title: 'Card 2', cols: 1, rows: 1 },
        //         { title: 'Card 3', cols: 1, rows: 1 },
        //         { title: 'Card 4', cols: 1, rows: 1 }
        //       ];
        //     }
      
        //     return [
        //       { title: 'Card 1', cols: 2, rows: 1 },
        //       { title: 'Card 2', cols: 1, rows: 1 },
        //       { title: 'Card 3', cols: 1, rows: 2 },
        //       { title: 'Card 4', cols: 1, rows: 1 }
        //     ];
        //   })
        // );

}
