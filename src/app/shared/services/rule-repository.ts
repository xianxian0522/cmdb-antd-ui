import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from './base.repository';
import {Rule} from '../models/rule';

const API = '/api/alerts';

@Injectable({
  providedIn: 'root'
})
export class RuleRepository extends BaseRepository<Rule> {
  constructor(protected _httpClient: HttpClient) {
    super(_httpClient);
  }

  protected api(): string {
    return API;
  }
}
