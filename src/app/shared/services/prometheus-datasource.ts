import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PrometheusResponse} from '../models/chart';
import {Observable} from 'rxjs';

const API = 'prometheus/api/v1/query_range';

@Injectable({
  providedIn: 'root'
})
export class PrometheusDatasource {
  constructor(protected httpClient: HttpClient) {}

  query(
      query: string,
      start: number,
      end: number,
      step: number
    ): Observable<PrometheusResponse> {
    const params = `?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`;
    return this.httpClient.get<PrometheusResponse>(`${API}${params}`);
  }
}
