import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from './base.repository';
import {Observable} from 'rxjs';

const API = '/token';

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  passowrd: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(protected httpClient: HttpClient) {
  }

  token(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/token', loginRequest);
  }
}
