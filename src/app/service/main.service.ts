import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
    providedIn: 'root'
})
export class MainService {
    apiUrl = 'http://localhost:3000/api';
    isActive = new Subject<boolean>();
    newUser = new Subject<boolean>();
    leftTime = new Subject<any>();

    constructor(private http: HttpClient,
                public jwtHelper: JwtHelperService,
    ) {
        this.countTime();
    }

    /*****************DEVICE***********************/

    getAllDevice() {
        return this.http.get(`${this.apiUrl}/device/`, {observe: 'response'});
    }

    getDeviceByName(name) {
        return this.http.get(`${this.apiUrl}/device/name/${name}`, {observe: 'response'});
    }

    getDevice(sn) {
        return this.http.get(`${this.apiUrl}/device/${sn}`, {observe: 'response'});
    }

    setDevice(device) {
        return this.http.post(`${this.apiUrl}/device/`, device, {observe: 'response'});
    }

    update(id, body) {
        return this.http.patch(`${this.apiUrl}/device/${id}`, body, {observe: 'response'});
    }

    login(user) {
        return this.http.post(`${this.apiUrl}/user/login/`, user, {observe: 'response'});
    }

    getHistory(sn) {
        return this.http.get(`${this.apiUrl}/history/sn/${sn}`, {observe: 'response'});
    }


    getCategories() {
        return this.http.get(`${this.apiUrl}/category/`, {observe: 'response'});
    }

    setCategory(body) {
        return this.http.post(`${this.apiUrl}/category/`, body, {observe: 'response'});
    }

    getLastStatDevice() {
        return this.http.get(`${this.apiUrl}/device/lastChanged`, {observe: 'response'});
    }

    /*****************COMPANY***********************/


    getAllCompany() {
        return this.http.get(`${this.apiUrl}/company/`, {observe: 'response'});
    }

    /*****************STATUSES***********************/

    getAllStatuses() {
        return this.http.get(`${this.apiUrl}/statuses/`, {observe: 'response'});
    }

    /*****************USERS***********************/

    getAllRoles() {
        return this.http.get(`${this.apiUrl}/role/`, {observe: 'response'});
    }

    getAllUsers() {
        return this.http.get(`${this.apiUrl}/user/`, {observe: 'response'});
    }

    getUser(id) {
        return this.http.get(`${this.apiUrl}/user/${id}`, {observe: 'response'});
    }

    setUser(body) {
        return this.http.post(`${this.apiUrl}/user/`, body, {observe: 'response'});
    }

    updateUser(id, body) {
        return this.http.put(`${this.apiUrl}/user/${id}`, body, {observe: 'response'});

    }


    /*****************STOCKTAKING***********************/
    markDeviceAsFind(id) {
        return this.http.get(`${this.apiUrl}/stocktaking/confirm/${id}`, {observe: 'response'});
    }

    createNewStacktaking() {
        return this.http.get(`${this.apiUrl}/stocktaking/new`, {observe: 'response'});
    }

    getOpenStacktaking() {
        return this.http.get(`${this.apiUrl}/stocktaking/open`, {observe: 'response'});
    }

    closeStocktaking(id) {
        return this.http.get(`${this.apiUrl}/stocktaking/close/${id}`, {observe: 'response'});
    }

    getAllStocktaking() {
        return this.http.get(`${this.apiUrl}/stocktaking`, {observe: 'response'});
    }

    getOneStocktaking(id) {
        return this.http.get(`${this.apiUrl}/stocktaking/${id}`, {observe: 'response'});
    }


    /*****************OTHER***********************/


    displayLocalTime(UTCTime) {
        if (UTCTime) {
            return (new Date(UTCTime).toLocaleDateString());
        } else {
            return '';
        }
    }

    displayDate(UTCTime) {
        if (UTCTime) {
            return moment(UTCTime).lang('pl').format('Do MMMM YYYY, HH:mm:ss');
        } else {
            return '';
        }
    }

    checkIsActive() {
        return this.isActive.asObservable();
    }

    isNewUser() {
        return this.newUser.asObservable();
    }

    generateSn() {
        var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            serialLength = 10,
            randomSerial = '',
            i,
            randomNumber;
        for (i = 0; i < serialLength; i++) {
            randomNumber = Math.floor(Math.random() * chars.length);
            randomSerial += chars.substring(randomNumber, randomNumber + 1);
        }
        return randomSerial;
    }

    countTime() {
        setInterval(() => {
            const user = this.jwtHelper.decodeToken(localStorage.getItem('token'));
            if (user) {
                const time = (<any>new Date(user.exp * 1000) - <any>new Date());
                this.leftTime.next(time);
            }
        }, 1000);
    }

    getTimeLeft() {
        return this.leftTime.asObservable();
    }
}
