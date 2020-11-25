import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from './base.repository';
import {Rule} from '../models/rule';
import {Observable} from 'rxjs';

const API = '/api/alerts';

@Injectable({
  providedIn: 'root'
})
export class RuleRepository extends BaseRepository<Rule> {
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
export class RuleNotifiers {
  constructor(protected httpClient: HttpClient) {}

  getNotifiersName(): Observable<any> {
    return this.httpClient.get('/api/notifiers');
  }
}

