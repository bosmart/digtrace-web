import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "./user.service";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DjangoJobPlyService {
  public apiUrl:any;

  constructor(private http: HttpClient, private _userService: UserService) {this.apiUrl=environment['apiUrl'] }

  getPlyFromDjango(id){

    console.log('printing from getPlyFromDjango');
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("digtrace"))["token"]}),
        // 'responseType': 'application/octet-strea' as 'json'
              'responseType': 'blob' as 'json'





      // withCredentials: true,
      // origin: "http://localhost:4200"
    };    
    // let response = this.http.get('http://10.0.75.1:8000/api/get_ply_file/?job='.concat(id), httpOptions);
    // let blobed_response = new Blob([response], { type: 'application/octet-stream'});
    // console.log('blobed:')
    //
    // console.log(blobed_response.size)
    
    return this.http.get<Blob>(environment['apiUrl'].concat( '/api/get_ply_file/?job='.concat(id)), httpOptions)
    // return blobed_response
   }






}
