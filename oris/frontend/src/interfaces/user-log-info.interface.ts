export interface UserLogInfo {
    id: string;
    info: string;
    message: string;
    environment: 'test' | 'dev' | 'prod'
  }