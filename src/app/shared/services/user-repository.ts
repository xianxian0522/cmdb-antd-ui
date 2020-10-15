import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {BaseRepository} from './base.repository';

const API = '/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserRepository extends BaseRepository<User> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected api(): string {
    return API;
  }
}
