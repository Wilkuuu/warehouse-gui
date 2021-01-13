import { Injectable } from '@angular/core';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DeviceListService {

  constructor() { }

  getPattern() {
    return {
      deviceList: [
        {
          data: 'name',
          title: 'Name'
        },
        {
          data: 'description',
          title: 'Description'
        },
        {
          data: 'company.name',
          title: 'Company'
        },
        {
          data: 'status.name',
          title: 'Status'
        },
        {
          data: 'serialNumber',
          title: 'Serial number'
        },
        {
          data: 'dateIn',
          title: 'Date in',
          render:  (date) => {
            return moment(date).lang('pl').format('Do MMMM YYYY, HH:mm:ss');
          }
        },
        {
          data: 'dateOut',
          title: 'Date out',
          render:  (date) => {
            return moment(date).lang('pl').format('Do MMMM YYYY, HH:mm:ss');
          }
        }
      ]
    };
  }

}
