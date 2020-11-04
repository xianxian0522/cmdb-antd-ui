import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class HttpService {
  constructor(private router: Router, private httpClient: HttpClient) {
  }

  getAuthorizationToken(): string {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    if (token) {
      const authorizationToken = `Bearer ${token}`;
      return authorizationToken;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
