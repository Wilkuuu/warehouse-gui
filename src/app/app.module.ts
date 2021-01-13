import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AddDeviceComponent } from './add-device/add-device.component';
import { CheckListComponent } from './check-list/check-list.component';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { DetailDeviceComponent } from './detail-device/detail-device.component';
import { NgQRCodeReaderModule } from 'ng2-qrcode-reader';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { FindDeviceComponent } from './find-device/find-device.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StocktakingComponent } from './stocktaking/stocktaking.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './service/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { DataTableComponent } from './data-table/data-table.component';
import { GenerateSerialComponent } from './generate-serial/generate-serial.component';
import { UserComponent } from './user/user.component';
import { OrderModule } from 'ngx-order-pipe';
import { HeaderInterceptor } from './@core/http-interceptor/header-interceptor';
import { ManagementStocktakingComponent } from './stocktaking/management-stocktaking/management-stocktaking.component';
import { HistoryComponent } from './stocktaking/history/history.component';





export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    AddDeviceComponent,
    CheckListComponent,
    DetailDeviceComponent,
    FindDeviceComponent,
    StocktakingComponent,
    LoginComponent,
    DataTableComponent,
    GenerateSerialComponent,
    UserComponent,
    ManagementStocktakingComponent,
    HistoryComponent
  ],
    imports: [
        BrowserModule,
        NgbModule,
        DeviceDetectorModule.forRoot(),
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 4000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        HttpClientModule,
        NgxQRCodeModule,
        QRCodeModule,
        AppRoutingModule,
        NgQRCodeReaderModule,
        FormsModule,
        NgQrScannerModule,
        ZXingScannerModule,
        JwtModule.forRoot({
            config: {
                tokenGetter
            }
        }),
        OrderModule
    ],
  providers: [AuthGuardService, {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
