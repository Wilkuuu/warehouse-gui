import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MainService } from './main.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public jwtHelper: JwtHelperService,
              private toast: ToastrService,
              private mainService: MainService,
              public router: Router) {
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const value = !this.jwtHelper.isTokenExpired(token);
    this.mainService.isActive.next(value);
    return value;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    } else {
      if (route.data.exceptedRight && this.jwtHelper.decodeToken().role.role !== route.data.exceptedRight) {
        this.toast.warning('Only users with permissions can do this.', 'Access denied');
        return false;
      } else {
        return true;
      }
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
