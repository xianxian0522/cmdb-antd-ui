import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from './base.repository';
import {Dashboards} from '../models/dashboards';

const API = '/api/dashboards';

@Injectable({
  providedIn: 'root'
})
export class DashboardRepository extends BaseRepository<Dashboards> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected api(): string {
    return API;
  }
}
