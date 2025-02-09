import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient, private router:Router) { }
  
  apiRoot = environment['apiUrl'] 

  callApi(path,method="GET",body?,headerItems?,authPage?,others?){             

    let options = {
      body,      
      headers:  {
            "Authorization": !authPage && ("Bearer" + " " + this.getToken('digtrace')),      
            ...headerItems
      },
      ...others
    }
      
    return this.http.request(method,this.apiRoot+path, options)             
  }
  
  getToken(tokenName){
    let now = new Date()
    
    let itemStr = localStorage.getItem(tokenName)

    if(!itemStr){
      this.router.navigateByUrl('/auth/login') 
    }
    
    let item = JSON.parse(itemStr)
    
    if(now.getTime()>item.expiryDate){      
      localStorage.removeItem('digtrace')     
      this.router.navigateByUrl('auth/login') 
    }
    else{      
      return item.token
    }
  }
}




