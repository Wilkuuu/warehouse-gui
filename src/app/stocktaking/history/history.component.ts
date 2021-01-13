import { Component, OnInit } from '@angular/core';
import { MainService } from '../../service/main.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    stocktakingList;
    detailData;
    constructor(private mainService: MainService) {
    }

    ngOnInit() {
    this.mainService.getAllStocktaking().subscribe(res => {
        this.stocktakingList = res.body;
    }, error => console.log(error));
    }

    loadData(idx: number) {
        this.mainService.getOneStocktaking(idx).subscribe(res => {
            this.detailData = res.body;
            console.log(this.detailData);
        });
    }
}
