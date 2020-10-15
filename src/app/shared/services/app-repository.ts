import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {App} from '../models/app';
import {BaseRepository} from './base.repository';

const API = '/api/apps';

@Injectable({
  providedIn: 'root'
})
export class AppRepository extends BaseRepository<App> {
  constructor(protected _httpClient: HttpClient) {
    super(_httpClient);
  }

  protected api(): string {
    return API;
  }
}
