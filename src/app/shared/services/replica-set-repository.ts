import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReplicaSet} from '../models/replica-set';
import {BaseRepository} from './base.repository';

const API = '/api/replicasets';

@Injectable({
  providedIn: 'root'
})
export class ReplicaSetRepository extends BaseRepository<ReplicaSet> {
  constructor(protected _httpClient: HttpClient) {
    super(_httpClient);
  }

  protected api(): string {
    return API;
  }
}
