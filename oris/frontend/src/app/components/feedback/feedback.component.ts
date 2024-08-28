import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RequestState } from 'src/enum/request-state.enum';
import { Answer, Feedback } from 'src/interfaces/feedback.interface';
import { AppAndProductStagingService } from 'src/services/app-and-product-staging.service';
import { NotificationService } from 'src/services/notification.service';
import { v1 as uuidv1 } from 'uuid';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnDestroy {
  form: FormGroup;
  addClass = '';
  formSubmissionSub =this.apiService.formSubmission;
  savedForm$ = this.apiService.savedForm$;
  sub : Subscription;

  questions = [
    { id: '1', question: 'How is the User Interface?', options: ['😊 Excellent', '🙂 Good', '😐 Satisfactory', '☹️ Poor'] },
    { id: '2', question: 'How is the User Experience?', options: ['😊 Excellent', '🙂 Good', '😐 Satisfactory', '☹️ Poor'] }
  ]

  commentsFromControl = { 'comments': new FormControl<string | null>(null) };

  constructor(private fb: FormBuilder, private apiService: AppAndProductStagingService, private notify: NotificationService) {

    this.sub = this.savedForm$.subscribe(response => {
      switch(response.state){
        case RequestState.LOADING : {
          this.addClass = 'loading';
          break;
        }
        case RequestState.LOADED : {
          this.addClass = '';
          this.notify.pushNotification({title: 'Success', msg: 'Thanks for the feedback', icon: 'icon-check', status: 'green'});
          break;
        }
        case RequestState.ERROR : {
          this.addClass = '';
          this.notify.pushNotification({title: 'Error', msg: 'Something went wrong', icon: 'icon-triangle-warning', status: 'red'});
          break;
        }
        default : this.addClass = '';
      }
    })
    this.form = fb.group({
      ...this.commentsFromControl,
      ...this.questions.reduce((acc, question) => ({
        ...acc,
        [question.id]: new FormControl(null, Validators.required)
      }), {})
    });
  }
  
  sendFeedbackData() {
    const comments = this.form.getRawValue()['comments'] as string;
    const response = this.questions.map(q => {
      const answer = this.form.getRawValue()[q.id] as string;
      return <Answer>{
        id: q.id,
        question: q.question,
        answer: answer.slice(3)
      }
    })

    const commentsEmpty = comments === null || comments === '';
    const feedback : Feedback = { id: uuidv1(),  timestamp: new Date().getTime(), response, ...( commentsEmpty ? {} : {comments} ) };
    this.formSubmissionSub.next(feedback);
  }

  clearResponse() {
    this.form.reset();
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }
}

