import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {HttpService} from './httpService';
import { Observable } from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private httpService: HttpService,
    private messageService: NzMessageService,
    private router: Router,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.httpService.getAuthorizationToken();
    if (authToken) {
      req = req.clone({
        // headers: req.headers.set('Authorization', authToken)
        setHeaders: {Authorization: authToken}
      });
    }
    return next.handle(req).pipe(
      tap(
        event => {
          // console.log(event, '获取返回内容');
          if (event instanceof HttpResponse) {
            console.log('success');
          }
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 500) {
              this.messageService.error('出错了', {nzDuration: 3000});
            } else if (err.status === 401) {
              this.router.navigate(['/login']);
            } else {
              this.messageService.error(err.message, {nzDuration: 3000});
            }
          }
        }
      )
    );
  }
}
