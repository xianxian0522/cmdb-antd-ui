import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Instance} from '../models/instance';
import {BaseRepository} from './base.repository';

const API = '/api/instances';

@Injectable({
  providedIn: 'root'
})
export class InstanceRepository extends BaseRepository<Instance> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected api(): string {
    return API;
  }
}
