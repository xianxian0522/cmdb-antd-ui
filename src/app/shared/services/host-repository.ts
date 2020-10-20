import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Host} from '../models/host';
import {BaseRepository} from './base.repository';

const API = '/api/hosts';

@Injectable({
  providedIn: 'root'
})
export class HostRepository extends BaseRepository<Host> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected api(): string {
    return API;
  }
}
