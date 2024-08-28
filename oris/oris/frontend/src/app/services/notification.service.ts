import { Injectable, OnDestroy } from '@angular/core';
import { Notification } from '@eds/vanilla';
import { NotificationMsg } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {

  notification !: Notification;

  pushNotification(notification: NotificationMsg) {
    this.notification = new Notification({
      title: notification.msg,
      icon: notification.icon,
      stripeColor: notification.status,
      timeout: 5000,
    })
    this.notification.init();
  }

  ngOnDestroy(): void {
    this.notification.destroy();
  }

}
