import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../service/main.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit {

  device: any = {name: '', company: '', description: ''};
  newSn = null;
  company: Interfaces.CompanyInterface[] = [];
  statuses: Interfaces.StatusInterface[] = [];
  newDataBase;
  allCategory: any[];
  category = {name: null, description: null};
  allDeviceName: any[] = [];
  @ViewChild('catModal') catModal;


  constructor(private mainService: MainService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.newSn = this.route.snapshot.queryParamMap.get('sn');
    this.allDeviceName = [];
    this.mainService.getAllCompany().subscribe((res: any) => {
      this.company = res.body;
    }, error => console.log(error));
    this.mainService.getAllStatuses().subscribe((res: any) => {
      this.statuses = res.body;
    }, error => console.log(error));
    this.mainService.getAllDevice().subscribe((res: any) => {
      res.body.forEach((el) => {
        if (this.allDeviceName.indexOf(el.name) < 0) {
          this.allDeviceName.push(el.name);
        }
      });
    });
    this.mainService.getCategories().subscribe((res: any) => {
      this.allCategory = res.body;
    }, error => console.log(error));
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.newSn === null) {
        this.newSn = this.mainService.generateSn();
      }
      this.newDataBase = document.getElementsByTagName('img');
      this.device.serialNumber = this.newSn;
      this.device.dateIn = new Date().toUTCString();
      this.mainService.setDevice(this.device).subscribe((res: any) => {
        console.log(res);
      }, error => console.log(error), () => {
        form.reset();
        this.router.navigate(['device/' + this.device.serialNumber]);
      });
    }
  }

  openCatModal() {
    this.modalService.open(this.catModal, {
      size: 'lg', backdrop: 'static',
      keyboard: false
    });
  }

  addCategory(form: NgForm) {
    this.mainService.setCategory(form.value).subscribe(res => console.log(res), error => console.log(error), () => {
      this.mainService.getCategories().subscribe((res: any) => {
        this.allCategory = res.body;
      }, error => console.log(error));
      this.closeModal();
    });
  }


  closeModal() {
    this.modalService.dismissAll();
  }


  printQRCode() {
    if (Object.keys(this.newDataBase).length === 0) {
      setTimeout(() => {
        this.printQRCode();
      }, 500);
    } else {
      console.log(this.newDataBase['0'].src);
    }
  }
}
