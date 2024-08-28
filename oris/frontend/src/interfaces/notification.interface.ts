export interface NotificationMsg {
    title: string
    msg: string,
    status: 'green' | 'red' | 'orange',
    icon?:  'icon-check' | 'icon-triangle-warning' | 'icon-flag' | 'icon-info' | 'icon-fault'
  }