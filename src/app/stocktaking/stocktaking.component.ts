import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { BarcodeFormat, Result } from "@zxing/library";
import { MainService } from "../service/main.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-stocktaking',
    templateUrl: './stocktaking.component.html',
    styleUrls: ['./stocktaking.component.scss']
})
export class StocktakingComponent implements OnInit {

    torchEnabled = false;
    torchAvailable$ = new BehaviorSubject<boolean>(false);
    tryHarder = false;
    allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/];
    formatsEnabled: BarcodeFormat[] = [
        BarcodeFormat.CODE_128,
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.EAN_13,
        BarcodeFormat.QR_CODE,
    ];
    currentDevice: MediaDeviceInfo = null;
    availableDevices: MediaDeviceInfo[] = [];
    hasDevices: boolean;
    hasPermission: boolean;
    qrResultString: string = null;
    qrResult: Result;
    tempString;
    currentStocktaking;
    activeStocktaking;
    confirmedDevice;
    leftDevice;

    // allDevice: Interfaces.DeviceInterface[] = [];

    constructor(private mainService: MainService,
                private toast: ToastrService) {
    }

    ngOnInit() {

        this.mainService.getOpenStacktaking().subscribe((res: any) => {
            this.activeStocktaking = res.body;
            this.currentStocktaking = this.activeStocktaking[0].stocktakingId;
        }, error => console.log(error), () => {
            this.countLeft();
        });
        // this.mainService.getAllDevice().subscribe((res: any) => {
        //     this.allDevice = res.body;
        //     this.allDevice.forEach(el => {
        //         el.find = false;
        //     });
        // });

    }

    onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.availableDevices = devices;
        this.hasDevices = Boolean(devices && devices.length);
        this.availableDevices.forEach(el => {
            if (el.label.indexOf('back') > 0) {
                this.currentDevice = el;
            } else {
                this.currentDevice = this.availableDevices[0];
            }
        });
    }

    switchCamera() {
        this.currentDevice = this.availableDevices[1];
    }

    onCodeResult(resultString: string) {
        if (this.tempString === resultString) {
        } else {
            this.tempString = resultString;
            // TODO get data for stocktaking
            const x = this.activeStocktaking.find(el => el.device.serialNumber === resultString);
            this.mainService.markDeviceAsFind(x.idx).subscribe((res: any) => {
                    this.toast.success('Find device');
                }, error => console.log(error),
                () => {
                    this.activeStocktaking.find(el => el.device.serialNumber === resultString).confirmed = true;
                    this.countLeft();
                });
            // if (x) {
            //     if (x.find) {
            //         this.toast.warning('Again');
            //     } else {
            //         x.find = true;
            //         this.toast.success('Find device');
            //     }
            // }
        }
    }

    onHasPermission(has: boolean) {
        this.hasPermission = has;
    }

    onTorchCompatible(isCompatible: boolean): void {
        this.torchAvailable$.next(isCompatible || false);
    }

    clearResult(): void {
        this.qrResultString = null;
    }

    onDeviceSelectChange(selected: string) {
        const device = this.availableDevices.find(x => x.deviceId === selected);
        this.currentDevice = device || null;
    }

    startNewStocktaking() {
        this.mainService.createNewStacktaking().subscribe((resp: any) => {
            this.mainService.getOpenStacktaking().subscribe((res: any) => {
                this.activeStocktaking = res.body;
                this.currentStocktaking = this.activeStocktaking[0].stocktakingId;
            }, error => console.log(error));
        }, error => {
            this.toast.error(error.error.message, 'Error');
        });
    }

    countLeft() {
        const confirmedArray = [];
        const notConfirmedArray = [];
        this.activeStocktaking.forEach(el => {
            if (el.confirmed) {
                confirmedArray.push(el);
            } else {
                notConfirmedArray.push(el);
            }
        });
        this.leftDevice = notConfirmedArray.length;
        this.confirmedDevice = confirmedArray.length;

    }
}
