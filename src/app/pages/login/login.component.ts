import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {LoginService} from '../../shared/services/login.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private nzMessageService: NzMessageService,
    private router: Router,
  ) { }

  loginForm = this.fb.group({
    userName: [''],
    password: ['']
  });

  ngOnInit(): void {
  }

  submitForm(): void {
    console.log('提交', this.loginForm.value);
    const value = this.loginForm.value;
    this.loginService.token(value).subscribe(res => {
      if (res) {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/cmdb/user']);
      }
    }, err => {
      this.nzMessageService.error('用户名或者密码错误', {nzDuration: 3000});
    });
  }
}
