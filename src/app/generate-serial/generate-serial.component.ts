import { Component, OnInit } from '@angular/core';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-generate-serial',
  templateUrl: './generate-serial.component.html',
  styleUrls: ['./generate-serial.component.scss']
})
export class GenerateSerialComponent implements OnInit {
  count = 1;
  newSerials = [];
  tempData = null;


  constructor(private mainService: MainService) {
  }

  ngOnInit() {

  }

  generateSn() {
    this.newSerials = [];
    for (let i = 0; i < this.count; i++) {
      this.newSerials.push(this.mainService.generateSn());
    }
  }

}
