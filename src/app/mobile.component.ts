import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AlertTicketRepository} from './shared/services/alert-ticket-repository';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit, AfterViewInit{
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private alertTicketRepository: AlertTicketRepository,
  ) {
  }

  alertData: any;
  alertHeadData: any;
  alertTotal: number;
  @Input() ispc;

  ngOnInit(): void {
    // this.activatedRoute.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     console.log(params, '得到的是');
    //     return of(1);
    //   })
    // );
    this.getAlertTicket();
  }
  ngAfterViewInit(): void {
    if (this.ispc === undefined) {
      const id = this.location.path(true).split('/')[2];
      this.getData(id);
    }
  }

  getAlertTicket(): void {
    this.location.onUrlChange(url => {
      if (url.indexOf('alerttickets') === 1) {
        const id = url.split('/')[2];
        this.getData(id);
      }
    });
  }
  getData(id): void {
    this.alertTicketRepository.getById(parseInt(id, 10)).subscribe(res => {
      this.alertData = res.alerts;
      this.alertHeadData = Object.keys(res.commonLabels).sort().map(v => `${v}=${res.commonLabels[v]}`).join(' ');
      this.alertTotal = res.alerts.length;
      console.log(res);
      this.alertData.forEach(s => {
        s.labels = Object.keys(s.labels).sort().map(k => `${k}=${s.labels[k]}`);
        s.annotations = Object.keys(s.annotations).sort().map(k => `${k}=${s.annotations[k]}`);
      });
    }, err => {
      console.error(err);
    });
  }
}
