import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AlertTicketRepository} from './shared/services/alert-ticket-repository';

@Component({
  selector: 'app-iphone',
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
  ngOnInit(): void {
    // this.activatedRoute.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     console.log(params, '得到的是');
    //     return of(1);
    //   })
    // );
    this.location.onUrlChange(url => {
      if (url.indexOf('alerttickets') === 1) {
        const id = url.split('/')[2];
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
    });
  }
  ngAfterViewInit(): void {
  }
}
