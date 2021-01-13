import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../service/main.service';
import { DeviceListService } from './device-list.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
    selector: 'app-check-list',
    templateUrl: './check-list.component.html',
    styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {

    searchString;

    allDevice: Interfaces.DeviceInterface[];
    pattern;
    apiUrl;
    order = 'info.name';
    reverse = false;
    busy = false;


    constructor(public mainService: MainService,
                private deviceList: DeviceListService) {
        this.apiUrl = this.mainService.apiUrl;
    }


    ngOnInit() {
        this.pattern = this.deviceList.getPattern();
        this.mainService.getAllDevice().subscribe((res: any) => {
                this.allDevice = res.body;
            }, error => {
            },
            () => {
            });
    }

    find() {
        if (this.searchString) {
            if (!this.busy) {
                this.busy = !this.busy;
                setTimeout(() => {
                    this.mainService.getDeviceByName(this.searchString).subscribe((res: any) => {
                        this.allDevice = res.body;
                    });
                    this.busy = !this.busy;
                }, 500);
            }
        } else {
            this.mainService.getAllDevice().subscribe((res: any) => {
                    this.allDevice = res.body;
                }, error => {
                },
                () => {
                });
        }
    }


    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    rowCallback = (row: Node, data: any | Object, index: number) => {
        //
        // if (!data.readed) {
        //   $('td', row).addClass('unreadedMessage');
        // } else {
        //   $('td', row).addClass('readedMessage');
        // }
        // $('td:eq(2)', row).removeClass(() => {
        //   if (!data.readed) {
        //     return 'unreadedMessage';
        //   } else {
        //     return 'readedMessage';
        //   }
        //
        // });
        //
        // $('td:eq(2)', row).addClass(() => {
        //   if (data.status === this.errorStatus.critical) {
        //     return 'dangerRow';
        //   } else if (data.status === this.errorStatus.warning) {
        //     return 'warningRow';
        //   } else {
        //     return 'notificationRow';
        //   }
        // });
        return row;
    };

    openMessage(event) {
        // this.notification = event;
        // this.open();
    }


}
