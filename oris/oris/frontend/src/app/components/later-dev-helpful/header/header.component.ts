import { AfterViewInit, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_SELECT_CONFIG, MatSelect, MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { AppHeaderService } from 'src/app/services/app-header.service';
import { PipelineApiService } from 'src/app/services/pipeline-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'outer-select-border' }
    }
  ]
})
export class HeaderComponent implements AfterViewInit, OnDestroy{

  @ViewChild('outerSelect') outerSelect !: MatSelect;
  // @ViewChild('innerSelect') innerSelect !: MatSelect;
  // @ViewChild('nativeOuterOption') nativeOuterOption !: MatOption;
  // @ViewChild('dynamicOuterOption') dynamicOuterOption !: MatOption;
  // @ViewChildren('innerOptions') innerOptions !: QueryList<MatOption>;
  private maxDateLimit = new Date();
  private subscription!: Subscription;

  private headerService = inject(AppHeaderService);
  timeFormats = this.headerService.timeFormats;
  frequentTimeRangeSuggestions = this.headerService.frequentTimeRangeSuggestions;

  // timeChanger = new BehaviorSubject<string>('Last 24 hours');
  // timeChanger$ = this.timeChanger.asObservable();
  // number$$ = new Subject<string>();
  // format$$ = new Subject<string>();
  // customValue = '' ;
  outerValue = this.frequentTimeRangeSuggestions[2].value;
  outerSelect$$ = new BehaviorSubject<string>(this.outerValue);
  outerSelect$ = this.outerSelect$$.asObservable();
  // innerValue = this.timeFormats[0].value;
  
  constructor(private _formBuilder: FormBuilder, private apiService: PipelineApiService){
    this.maxDateLimit.setFullYear(this.maxDateLimit.getFullYear() - 3);
  }
  ngAfterViewInit(): void {
    this.outerSelect$.pipe(
      tap((input) => {
        this.apiService.timeChange.next(input);
      })
    ).subscribe();
  }
  
  updateDashboard(event: MatSelectChange) {
    this.outerSelect$$.next(event as unknown as string);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ngOnInit(): void {
    // this.subscription= combineLatest([this.number$$.asObservable(), this.format$$.asObservable()])
    // .subscribe( {
    //   next: ([t, f]) => {
    //     const val = (t === '' || f === 'None') ? '' :  `Last ${t} ${f}`;
    //     if(t !== 'skip'  && f != 'skip'){
    //       this.timeChanger.next(val);
    //       this.dynamicOuterOption.select(true);
          
    //       // this.innerSelect._selectionModel.setSelection(this.innerOptions.get());
    //       this.innerSelect.writeValue('today')
    //       // this.innerOptions._stateChanges.next()
    //     } 
        
    //   },
    //   error: err => console.log(err),
    //   complete: () => console.log("I am done")
    // } );
  // }


  // closeSelect(event: Event) {
  //   this.outerSelect.close()
  // }

  // handleInnerSelect(value: string){
  //   this.outerSelect.open();
    
  //   this.innerSelect.writeValue('today')
  //   this.format$$.next(value);
  // }

  // handleOuterSelect(value: string){
  //   this.timeChanger.next(value);
  //   this.format$$.next('skip');
  //   this.number$$.next('skip');
  // }

  // updateSelectedTime(){
  //   this.number$$.next(this.customValue);
  // }

  // resetInputFields(){
  //   this.customValue = '';
    
  // }

  // whichOneAreYou(event: MatOptionSelectionChange<string>){
  // }

  // whichOneAreYouInside(event: MatOptionSelectionChange<string>){
    
  //   this.innerSelect._selectionModel.setSelection(event.source);
  //   this.innerSelect.writeValue('today')

    
    
  // }



}
