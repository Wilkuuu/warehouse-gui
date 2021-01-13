import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from '../service/auth-guard.service';
import { MainService } from '../service/main.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor(private auth: AuthGuardService,
                public jwtHelper: JwtHelperService,
                public router: Router,
                private mainService: MainService) {
    }

    isLogged = false;
    user = null;
    timeLeft: string;
    lessTime = false;
    private timeLeftNumber: any;

    ngOnInit() {
        this.user = this.jwtHelper.decodeToken(localStorage.getItem('token'));
        this.mainService.checkIsActive().subscribe(res => {
            this.isLogged = res;
        });
        this.mainService.isNewUser().subscribe(res => {
            if (res) {
                this.user = this.jwtHelper.decodeToken(localStorage.getItem('token'));
            }
        });
        this.mainService.getTimeLeft().subscribe(res => {
            this.timeLeftNumber = res;
            this.timeLeft = this.millisToMinutesAndSeconds(res);
            if ((res / 1000) < 60) {
                this.lessTime = true;
                if((res / 1000) < 0 ) {
                    this.logout();
                }
            }
        }, error => {
        }, () => {
            if (this.timeLeft && ( this.timeLeftNumber < 0)) {
                this.logout();
            }
        });
    }

    millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ':' + (parseInt(seconds) < 10 ? '0' : '') + seconds;
    }

    logout() {
        localStorage.removeItem('token');
        this.mainService.newUser.next(false);
        this.isLogged = false;
        this.router.navigate(['/login']);
    }
}
