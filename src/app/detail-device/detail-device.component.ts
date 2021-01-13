import {
  Component,
  ElementRef,
  OnInit,
  Pipe,
  PipeTransform,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { QrScannerComponent } from 'angular2-qrscanner';
import { MainService } from '../service/main.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-detail-device',
  templateUrl: './detail-device.component.html',
  styleUrls: ['./detail-device.component.scss'],
  encapsulation: ViewEncapsulation.None,

})

export class DetailDeviceComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              public mainService: MainService,
              private deviceService: DeviceDetectorService,
              private modalService: NgbModal) {
  }

  @ViewChild('historyModal') historyModel;


  device: Interfaces.DeviceInterface = {
    idx: null,
    name: '',
    company: {idx: null, name: null, description: null},
    status: {idx: null, name: null, description: null},
    serialNumber: '',
  };
  deviceSn;
  deviceInfo = {isMobile: true, isDesktop: false};
  deviceStatus: Interfaces.StatusInterface[];
  openForm = false;
  newDataBase;
  showQr = false;
  deviceHistory: any[] = [];

  order: string = 'dateChange';
  reverse: boolean = true;


  ngOnInit() {
    this.newDataBase = document.getElementsByTagName('img');
    this.mainService.getAllStatuses().subscribe((res: any) => {
      this.deviceStatus = res.body;
    });
    this.deviceDetection();
    this.deviceSn = this.route.snapshot.paramMap.get('sn');
    this.mainService.getDevice(this.deviceSn).subscribe((res: any) => {
      this.device = res.body;
    }, error => console.log(error), () => {
    });
    this.mainService.getHistory(this.deviceSn).subscribe((res: any) => {
      this.deviceHistory = res.body;
    });
  }


  isObject(element) {
    if (typeof element === 'object') {
      return true;
    } else {
      return false;
    }
  }

  openModal(modal) {
    this.modalService.open(modal, {
      size: this.getModalSize(), backdrop: 'static',
      keyboard: false
    });
  }

  getModalSize() {
    if (this.deviceInfo.isMobile) {
      return 'sm';
    } else {
      return 'lg';
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  print() {
    if (Object.keys(this.newDataBase).length === 0) {
      setTimeout(() => {
        this.print();
      }, 500);
    } else {
      console.log(this.newDataBase);
      let printContents, popupWin;
      printContents = document.getElementById('print-section').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
      );
      // popupWin.document.close();
    }
  }

  deviceDetection() {
    {
      // this.deviceInfo = this.deviceService.getDeviceInfo();
      this.deviceInfo.isMobile = this.deviceService.isMobile();
      this.deviceInfo.isDesktop = this.deviceService.isDesktop();
      // const isMobile = this.deviceService.isMobile();
      // const isTablet = this.deviceService.isTablet();
      // const isDesktopDevice = this.deviceService.isDesktop();
      // console.log(this.deviceInfo);
      // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
      // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
      // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
    }
  }


  closeModal() {
    this.modalService.dismissAll();
  }

  onSubmit(form: NgForm) {
    this.device.dateOut = new Date().toUTCString();
    this.mainService.update(this.device.idx, this.device).subscribe((res: any) => {
    }, error => console.log(error), () => {
      this.closeModal();
      this.router.navigate(['/checkList']);
    });
  }


}
