import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { CheckListComponent } from './check-list/check-list.component';
import { DetailDeviceComponent } from './detail-device/detail-device.component';
import { FindDeviceComponent } from './find-device/find-device.component';
import { StocktakingComponent } from './stocktaking/stocktaking.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './service/auth-guard.service';
import { GenerateSerialComponent } from './generate-serial/generate-serial.component';
import { UserComponent } from './user/user.component';
import { ManagementStocktakingComponent } from './stocktaking/management-stocktaking/management-stocktaking.component';
import { HistoryComponent } from "./stocktaking/history/history.component";

const ROLE = {ADMIN: 'Admin'};

const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'addDevice', component: AddDeviceComponent, canActivate: [AuthGuardService]},
    {path: 'checkList', component: CheckListComponent, canActivate: [AuthGuardService]},
    {path: 'findDevice', component: FindDeviceComponent, canActivate: [AuthGuardService]},
    {path: 'stocktaking', component: StocktakingComponent, canActivate: [AuthGuardService]},
    {
        path: 'management-stocktaking/:id',
        component: ManagementStocktakingComponent,
        canActivate: [AuthGuardService],
        data: {exceptedRight: ROLE.ADMIN}
    },
    {
        path: 'stocktakingHistory',
        component: HistoryComponent,
        canActivate: [AuthGuardService],
        data: {exceptedRight: ROLE.ADMIN}
    },
    {
        path: 'serialGen',
        component: GenerateSerialComponent,
        canActivate: [AuthGuardService],
        data: {exceptedRight: ROLE.ADMIN}
    },
    {path: 'user', component: UserComponent, canActivate: [AuthGuardService], data: {exceptedRight: ROLE.ADMIN}},
    {path: 'user/:id', component: UserComponent, canActivate: [AuthGuardService]},
    {path: 'device/:sn', component: DetailDeviceComponent, canActivate: [AuthGuardService]},
    {path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
