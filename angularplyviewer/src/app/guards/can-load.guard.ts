import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CanLoadGuard implements CanLoad {  

  constructor(private router:Router){}

  canLoad():Observable<boolean> | Promise<boolean> | boolean {    
    if(!localStorage.getItem('digtrace')){
      this.router.navigateByUrl('/auth/login')
    }
    else{
      return true
    }
  }
  
}
