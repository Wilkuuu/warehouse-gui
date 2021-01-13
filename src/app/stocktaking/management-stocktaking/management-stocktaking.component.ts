import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../service/main.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-management-stocktaking',
    templateUrl: './management-stocktaking.component.html',
    styleUrls: ['./management-stocktaking.component.scss']
})
export class ManagementStocktakingComponent implements OnInit {

    allDevice = [];
    foundDevice = [];
    notFoundDevice = [];
    currentStocktaking;

    @ViewChild('confirmModal') confirmModal;

    constructor(private mainService: MainService,
                private modal: NgbModal,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.currentStocktaking = this.route.snapshot.paramMap.get('id');
        this.mainService.getOpenStacktaking().subscribe((res: any) => {
            this.foundDevice = [];
            this.notFoundDevice = [];
            this.allDevice = res.body;
            this.allDevice.forEach(el => {
                if (el.confirmed) {
                    this.foundDevice.push(el);
                } else {
                    this.notFoundDevice.push(el);
                }
            });
        });
    }

    verifyStocktakingEnd() {
        if(this.notFoundDevice.length === 0) {
            this.closeStocktaking();
        } else {
            this.modal.open(this.confirmModal, {
                size: 'lg', backdrop: 'static',
                keyboard: false
            });
        }
    }

    closeStocktaking() {
        this.mainService.closeStocktaking(this.currentStocktaking).subscribe(() => {
        }, error => console.log(error), () => {
            this.router.navigate(['/']);
        });
    }

    closeModal(){
        this.modal.dismissAll();
    }

}
