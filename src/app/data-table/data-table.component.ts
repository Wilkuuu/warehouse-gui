import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Event, NavigationEnd, Router } from '@angular/router';



import { CustomEvent } from './CustomEvent';
import { ToastrService } from 'ngx-toastr';
import { DataTableActions } from './DataTableActions';


export interface APIResponse {
  data: Array<any>;
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  info: any;
}

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements OnInit, OnChanges {
  @Input() type: string;
  @Input() pattern: [];
  @Input() source: string;
  @Input() timeout: number = 0;
  @Input() pageLength: number = 20;
  @Input() rebuildUrls: string[];
  @Input() data: object = {};
  @Input() start: boolean = true;
  @Input() paging: boolean = false;
  @Input() responsive: boolean = false;
  @Input() order: object = {};
  @Input() onRowCallback: () => void;
  @Input() extraData: any;
  @Output() rowAction: EventEmitter<CustomEvent>;
  @Output() onRowClick: EventEmitter<any>;
  @Output() onLoad: EventEmitter<any>;
  @Output() response: EventEmitter<APIResponse>;

  @ViewChild('dataTableContainer') table: ElementRef;

  private dataTable: any;
  private language: {};
  private filters: object = {};
  translation;

  constructor(private http: HttpClient,
              private toastr: ToastrService,
              public router: Router) {
    this.rowAction = new EventEmitter<CustomEvent>();
    this.onRowClick = new EventEmitter<CustomEvent>();
    this.onLoad = new EventEmitter<CustomEvent>();
    this.response = new EventEmitter<APIResponse>();

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (this.dataTable !== undefined && this.rebuildUrls !== undefined && this.rebuildUrls.includes(this.router.url)) {
          this.reload();
        }
      }
    });
  }

  ngOnInit() {
    if (this.timeout > 0) {
      this.start = false;
    }
    this.filters = this.data;
    this.rebuildTable();

    $(this.table.nativeElement).on('click', '[custom-event-action]', (event) => {
      event.preventDefault();
      const eventData = {
        action: $(event.currentTarget).attr('custom-event-action'),
        data: $(event.currentTarget).attr('custom-event-data')
      };
      this.rowAction.emit(eventData);
    }).on('click', `tr td:not(.${DataTableActions.ActionsColumnClass})`, (event) => {
      const data = this.dataTable.row(event.currentTarget.parentElement).data();
      this.onRowClick.emit(data);
    });

    if (this.timeout > 0) {
      setTimeout(() => {
        this.reload();
      }, this.timeout);
    }
  }

  ngOnChanges(changes: any) {
    if (changes.data) {
      this.filters = changes.data.currentValue;
      this.reload();
    }
  }

  rebuildTable(): void {
    this.dataTable = (<any>$(this.table.nativeElement)).DataTable({
      columns: this.getColumns(),
      serverSide: true,
      processing: true,
      paging: this.paging,
      pagingType: 'full_numbers',
      responsive: this.responsive,
      pageLength: this.pageLength,
      info: false,
      searching: this.searchingSwitch(),
      order: Object.keys(this.order).length > 0 ? this.order : [],
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.filters = this.filters;

        if (this.start) {
          this.http
            .get(this.source, {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }), params: this.objectToHttpParams(dataTablesParameters)
              }
            ).subscribe((resp: any) => {
            this.response.next(resp);
            if (resp) {
              callback({
                // recordsTotal: resp.recordsTotal,
                // recordsFiltered: resp.recordsFiltered,
                // data: resp.data
                data: resp
              });
            } else {
              this.toastr.error('Incorrect data');
              this.hideProcessing();
            }
            this.onLoad.emit();
          }, (error: HttpErrorResponse) => {
            console.log(error.error.error.code + ' ' + error.error.error.message);
            this.toastr.error(error.error.error.code, error.error.error.message);
            this.hideProcessing();
          });

          this.start = true;
        } else {
          this.hideProcessing();
        }
      },
      language: this.getLanguage('pl'),
      rowCallback: this.onRowCallback,
    });
    // $.fn.dataTable.ext.errMode = 'none';  // Disable alerts
    // $.fn.DataTable['ext'].pager.numbers_length = 15;
  }

  reload(): void {
    if (this.dataTable) {
      this.start = true;
      this.dataTable.destroy();
      this.rebuildTable();
    }
  }

  getColumns(): Array<object> {
    return this.pattern;
  }

  getLanguage(language): any {
    if (language === 'pl') {
      this.translation = {
        processing: 'Trwa ładowanie danych...',
        search: 'Szukaj:',
        lengthMenu: 'Wyświetl _MENU_ rekordów na stronie',
        info: 'zakres od _START_ do _END_ z _TOTAL_ elementów',
        infoEmpty: 'Wyświetlanie elementu 0   0 z 0 elementów',
        infoFiltered: '(filtrowany z wszystkich _MAX_  elementów)',
        infoPostFix: '',
        loadingRecords: 'Trwa ładowanie rekorów...',
        zeroRecords: 'Brak rekordów do wyświetlenia',
        emptyTable: 'Brak danych w tabeli',
        paginate: {
          first: 'Pierwszy',
          previous: 'Poprzedni',
          next: 'Następny',
          last: 'Ostatni'
        },
        aria: {
          sortAscending: ': Sortuj rosnąco',
          sortDescending: ': Sortuj malejąco'
        }
      };
      return (this.translation);
    } else {
      this.translation = {};
      return (this.translation);
    }
  }

  objectToHttpParams(obj: any) {
    return Object.entries(obj || {}).reduce((params, [key, value]) => {
      return params.set(
        key,
        typeof value === 'object' ? JSON.stringify(value) : value.toString()
      );
    }, new HttpParams());
  }


  showProcessing() {
    $(this.table.nativeElement).prev('.dataTables_processing').show();
  }

  hideProcessing() {
    $(this.table.nativeElement).prev('.dataTables_processing').hide();
  }

  searchingSwitch() {
    switch (this.type) {
      case 'devices':
        return true;
        break;
      case 'devicesRG':
        return true;
        break;
      default:
        return false;
    }
  }
}
