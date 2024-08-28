import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, debounceTime, delay, distinctUntilChanged, interval, map, of, startWith, switchMap, tap } from 'rxjs';
import { options } from 'src/constants/apps.constant';
import { RequestState } from 'src/enum/request-state.enum';
import { environment } from 'src/environments/environment';
import { AppProductStagingResponse, ResponseState } from '../interfaces/app-product-stage.interface';
import { Feedback } from '../interfaces/feedback.interface';

export type ChatResponse = {
  answer: string,
  status: string
}

@Injectable({
  providedIn: 'root',
})
export class AppAndProductStagingService {

  // private readonly url = 'http://localhost:8000/api';
  private readonly url = environment.djangoUrl;
  private appState = new BehaviorSubject<RequestState>(RequestState.IDLE);
  appState$ = this.appState.asObservable();
  formSubmission = new Subject<Feedback>();

  constructor(private http: HttpClient){}

  // chatBot(question: string) {
  //   return this.http.post<ChatResponse>(this.url+'/chat', { "question": question })
  // }

  realtimeRes$ : Observable<ResponseState<AppProductStagingResponse>> = this.http.get<AppProductStagingResponse>(`${this.url}/app-product-data/`,
  { params: { 'indices': 'cicd-report-center,product-staging-data' }})
  .pipe(
    map(response => <ResponseState<AppProductStagingResponse>>{ response, state: RequestState.LOADED }),
    startWith({ state: RequestState.LOADING }),
    catchError(() => of({ state: RequestState.ERROR })),
    tap(response => this.appState.next(response.state))
  )

  savedForm$ : Observable<ResponseState<any>> = this.formSubmission.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged((f1: Feedback, f2:Feedback) => this.ignoreDuplicateEntry(f1,f2)),
    switchMap(feedback => {
      return this.http.post(this.url+'/feedback', {'feedback': feedback})
      .pipe(
        delay(2000),
        map(response => <ResponseState<any>>{ response, state: RequestState.LOADED  }),
        startWith(<ResponseState<any>>{state: RequestState.LOADING}),
        catchError(()=> of(<ResponseState<any>>{state: RequestState.ERROR})),
      )
    }),
    tap(console.log)
  );

  ignoreDuplicateEntry(f1: Feedback,f2: Feedback){
    const f1answers = JSON.stringify(f1.response.map(res => res.answer));
    const f2answers = JSON.stringify(f2.response.map(res => res.answer));
    return  f1answers === f2answers && f1.comments === f2.comments;
  }

  //Time utils
  formattedClock$ = interval(1000).pipe(
    map(() => new Date().toLocaleString('en-US', options))
  )
}
