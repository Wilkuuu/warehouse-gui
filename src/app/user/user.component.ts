import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { MainService } from '../service/main.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    roles: { idx: number, role: string }[];
    user = {idx: null, name: null, role: null, password: null};
    userId = null;
    showUserList = false;
    allUsers: [];
    currentUser = null;
    editOtherUser = false;

    constructor(private mainService: MainService,
                public jwtHelper: JwtHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.userId = this.route.snapshot.paramMap.get('id');
        this.currentUser = this.user = this.jwtHelper.decodeToken(localStorage.getItem('token'));

        if (this.currentUser.role.role !== 'Admin') {
            if (this.userId !== this.currentUser.idx) {
                this.router.navigate([`/user/${this.currentUser.idx}`]);
                console.log('kombinator');
            } else {
                this.getData();

            }
        }
        this.getData();
    }

    getData() {
        this.mainService.getAllUsers().subscribe((res: any) => {
            this.allUsers = res.body;
        });
        if (this.userId) {
            this.getUser(this.userId);
        } else {
            this.user = {password: null, role: null, idx: null, name: null};
        }
        this.mainService.getAllRoles().subscribe((res: any) => {
            this.roles = res.body;
        }, error => console.log(error));
    }

    onSubmit(form: NgForm) {
        delete form.value.editOtherUser;
        if (!this.user.role) {
            this.toastr.warning('Choose role');
        } else {

            if (this.userId) {
                this.mainService.updateUser(this.userId, form.value).subscribe(res => {
                }, error => {
                    this.toastr.error('Error', error.error.message);
                }, () => {
                    form.reset();
                    this.router.navigate(['/']);
                });
            } else {
                this.mainService.setUser(form.value).subscribe((res: any) => {
                    console.log(res);
                }, error => {
                    if (error.status === 400) {
                        this.toastr.warning('That username exist in DB');
                    }
                }, () => {
                    form.reset();
                    this.router.navigate(['/']);
                });
            }
        }
    }

    getUser(id) {
        this.mainService.getUser(id).subscribe((res: any) => {
            const user = res.body;
            this.user = {name: user.name, idx: user.idx, role: user.role.idx, password: null};
        }, error => console.log(error), () => {
            if (id === this.currentUser.idx) {
                this.editOtherUser = false;
            } else {
                this.editOtherUser = true;
            }
        });
    }

}
