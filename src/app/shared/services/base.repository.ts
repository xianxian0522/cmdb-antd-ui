import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../models/page';

export abstract class BaseRepository<MODEL extends { id?: number }> {

  protected constructor(protected httpClient: HttpClient) {
  }

  protected abstract api(): string;

  queryAll(q?: { [key: string]: any }, select?: string[]): Observable<MODEL[]> {
    const params = this.genParams(q, select);
    const requestUrl = `${this.api()}?${params.toString()}`;
    return this.httpClient.get<MODEL[]>(requestUrl);
  }

  queryPage(page: number, size: number,
            q?: { [key: string]: any }, select?: string[]): Observable<Page<MODEL>> {
    let requestUrl = `${this.api()}?pageSize=${size}&pageNumber=${page}`;
    const params = this.genParams(q, select);
    requestUrl = `${requestUrl}&${params.toString()}`;
    return this.httpClient.get<Page<MODEL>>(requestUrl);
  }

  getById(id: number): Observable<MODEL> {
    return this.httpClient.get<MODEL>(`${this.api()}/${id}`);
  }

  getByChartId(chartId: number): Observable<MODEL> {
    return this.httpClient.get<MODEL>(`${this.api()}?chartId=${chartId}`);
  }

  add(model: MODEL): Observable<MODEL> {
    return this.httpClient.post<MODEL>(this.api(), model);
  }

  update(model: MODEL): Observable<MODEL> {
    return this.httpClient.patch<MODEL>(`${this.api()}/${model.id}`, model);
  }

  protected genParams(q?: { [key: string]: any }, select?: string[]) {
    const params = new URLSearchParams();
    const addValue = (key, value) => {
      if (value === 0) {
        value = '0';
      }
      if (value === false) {
        value = 'false';
      }
      if (value) {
        params.append(key, value);
      }
    }
    if (q) {
      Object.keys(q).forEach(k => {
        const v = q[k];
        if (v instanceof Array) {
          v.forEach(vv => addValue(k, vv));
          return;
        }
        addValue(k, v);
      });
    }
    if (select) {
      select.forEach(f => {
        params.append('select', f);
      });
    }
    return params;
  }
}
