import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface DecodedToken {
  username: string;
  admin: boolean;
  exp: number;
}

export interface DecodedTokenWithRawToken {
  username: string;
  admin: boolean;
  exp: number;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(protected httpClient: HttpClient) {
  }

  helper = new JwtHelperService();

  token(loginRequest: LoginRequest): Observable<DecodedTokenWithRawToken> {
    return this.httpClient.post<LoginResponse>('/token', loginRequest).pipe(map(r => {
      const dt = this.decode(r.token);
      return {...dt, token: r.token};
    }));
  }

  decode(token: string): DecodedToken {
    return this.helper.decodeToken<DecodedToken>(token);
  }
}
