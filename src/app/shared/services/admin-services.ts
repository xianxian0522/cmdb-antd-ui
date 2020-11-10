import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from './base.repository';
import {Admin} from '../models/admin';
import {Observable} from 'rxjs';

const API = '/api/supervisord/program';
const api = '/api/supervisord/supervisor';

@Injectable({
  providedIn: 'root'
})
export class AdminServices extends BaseRepository<Admin> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected api(): string {
    return API;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminSupervisordServices {
  constructor(protected httpClient: HttpClient) {}

  startProgram(names: string[]): Observable<string> {
    return this.httpClient.post(`${API}/startPrograms`, names, {responseType: 'text'});
  }
  startName(name: string): Observable<any> {
    return this.httpClient.post(`${API}/start/${name}`, null);
  }
  stopProgram(names: string[]): Observable<string> {
    return this.httpClient.post(`${API}/stopPrograms`, names, { responseType: 'text'});
  }
  stopName(name: string): Observable<{success: boolean}> {
    return this.httpClient.post<{ success: boolean }>(`${API}/stop/${name}`, null);
  }
  reloadProgram(): Observable<any> {
    return this.httpClient.post(`${api}/reload`, null);
  }
}
