import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription, catchError, debounceTime, delay, distinctUntilChanged, filter, fromEvent, interval, map, of, startWith, switchMap, tap } from 'rxjs';
import { RequestState } from 'src/enum/request-state.enum';
import { environment } from 'src/environments/environment';
import { v1 as uuidv1 } from 'uuid';
import { ResponseState } from '../interfaces/app-product-stage.interface';
import { UserLogInfo } from '../interfaces/user-log-info.interface';

export interface LogMetaData {msg: string, info: 'visited' | 're-visited'}

@Injectable({
  providedIn: 'root'
})
export class UsageTrackerService implements OnDestroy {

  private lastActivityTime: number = Date.now(); // On first visit
  private inactivityTimeout =  5 * 60 * 1000; // Session expires in 5min unless accessed
  private activitySubscription: Subscription | undefined;
  private setUserVisitedSub = new Subject<LogMetaData>();
  url: string = environment.djangoUrl;

  //  I should get this value from backend if needed to display on dashboard
  constructor(private http: HttpClient) {
    this.initializeInactivityTracking();
  }

  setUserVisited(log : LogMetaData) {
      this.setUserVisitedSub.next(log);
  }

  private initializeInactivityTracking(): void {
    this.activitySubscription = fromEvent(document, 'mousemove').pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => this.setUserVisited({msg: 'Revisited after session expiry', info: 're-visited'}) ),
    ).subscribe();

    interval(5000).subscribe(() => this.checkInactivity());
  }


  private sessionExpired = () => (Date.now() - this.lastActivityTime) > this.inactivityTimeout;

  private checkInactivity(): void {
    if (this.sessionExpired() && this.userVisited) {
      this.removeCookie();
    }
  }

  ////Utils
  storeUserLog$ = this.setUserVisitedSub.asObservable().pipe(
    filter(() => !this.userVisited),
    tap(() => {
      localStorage.setItem('visitedBefore', 'true');
      this.lastActivityTime = Date.now();
    }),
    map(({msg, info}) => {
      return <UserLogInfo> {
        id: this.generateUniqueId(),
        info,
        message: msg,
        environment: 'test'
      }
    }),
    switchMap(userLog => {
      return this.http.post(this.url+'/user-log', {"timestamp": new Date().toISOString(), "userLog": userLog})
      .pipe(
        delay(2000),
        tap(() => console.log('Stored the user log')),
        map(response => <ResponseState<any>>{ response, state: RequestState.LOADED  }),
        startWith(<ResponseState<any>>{state: RequestState.LOADING}),
        catchError(()=> of(<ResponseState<any>>{state: RequestState.ERROR})),
      )
    }),
  ).subscribe();

  removeCookie(): void {
    localStorage.removeItem('visitedBefore');
  }
  
  get userVisited() {
    return localStorage.getItem('visitedBefore');
  }

  private generateUniqueId(): string {
    return uuidv1();
  }

  ngOnDestroy(): void {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
