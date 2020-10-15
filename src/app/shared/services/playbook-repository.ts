import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Playbook} from '../models/playbook';
import {BaseRepository} from './base.repository';
import {Observable} from 'rxjs';

const API = '/api/playbooks';

@Injectable({
  providedIn: 'root'
})
export class PlaybookRepository extends BaseRepository<Playbook> {
  constructor(protected _httpClient: HttpClient) {
    super(_httpClient);
  }

  protected api(): string {
    return API;
  }

  run(id: number): Observable<PlayResult> {
    return this._httpClient.post<PlayResult>(`${this.api()}/${id}/run`, null);
  }
}

export interface PlayResult {
  error: string;
  stdout: string;
  stderr: string;
}
