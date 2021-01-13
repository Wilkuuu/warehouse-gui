import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuardService } from '../../service/auth-guard.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(public authService: AuthGuardService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({
      setHeaders: {
        // Authorization: `Bearer ${this.authService.getToken()}`
        Authorization: `${this.authService.getToken()}`
      }
    });

    return next.handle(request);
  }

}
