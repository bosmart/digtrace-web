import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from "./user.service";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DjangoJobService {

  constructor(private http: HttpClient, private _userService: UserService ) { }

  list(){
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this._userService.token}),
      // withCredentials: true,
      // origin: "http://localhost:4200"
    };

    return this.http.get(environment['apiUrl'].concat('/api/get_jobs'), httpOptions);



  }



}
