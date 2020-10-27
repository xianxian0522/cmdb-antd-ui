import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from './base.repository';
import {AlertTicket} from '../models/alert-ticket';

const API = '/api/alerttickets';

@Injectable({
  providedIn: 'root'
})
export class AlertTicketRepository extends BaseRepository<AlertTicket> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected api(): string {
    return API;
  }
}
