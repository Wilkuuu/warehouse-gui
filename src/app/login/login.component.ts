import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MainService } from '../service/main.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {name: null, password: null};


  constructor(public router: Router,
              private toastr: ToastrService,
              private mainService: MainService) {
  }

  ngOnInit() {
  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      this.mainService.login(form.value).subscribe((res: any) => {
        localStorage.setItem('token', res.body.token);
        this.mainService.newUser.next(true);
        this.router.navigate(['/findDevice']);
      }, error => {
        this.toastr.error( error.error.message, 'Error');
      });
    }
  }

}
