import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from './base.repository';

const API = '/token';

export interface Login {
  id?: number;
  userName: string;
  password: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseRepository<Login> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected api(): string {
    return API;
  }
}
