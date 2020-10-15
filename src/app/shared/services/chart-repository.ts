import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chart} from '../models/chart';
import {BaseRepository} from './base.repository';

const API = '/api/charts';

@Injectable({
  providedIn: 'root'
})
export class ChartRepository extends BaseRepository<Chart> {
  constructor(protected _httpClient: HttpClient) {
    super(_httpClient);
  }

  protected api(): string {
    return API;
  }
}
