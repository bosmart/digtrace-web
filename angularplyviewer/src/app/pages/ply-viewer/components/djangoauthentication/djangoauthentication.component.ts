import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {throwError} from 'rxjs';
import {Router} from "@angular/router";


@Component({
  selector: 'app-djangoauthentication',
  templateUrl: './djangoauthentication.component.html',
  styleUrls: ['./djangoauthentication.component.css']
})
export class DjangoauthenticationComponent implements OnInit {
 
  /**
   * An object representing the user for the login form
   */
  public user: any;
 
  constructor(public _userService: UserService) { }
 
  ngOnInit() {
    this.user = {
      username: '',
      password: ''
    };
  }
 
  login() {
    this._userService.login({'username': this.user.username, 'password': this.user.password});
  }
 
  refreshToken() {
    this._userService.refreshToken();
    console.log('print from djanguauth')

    console.log(this._userService.token)
  }
 
  logout() {
    this._userService.logout();
  }
 

}
