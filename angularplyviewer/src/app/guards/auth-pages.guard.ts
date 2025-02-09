import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthPagesGuard implements CanActivateChild {  

  constructor(private router:Router){}

  canActivateChild():Observable<boolean> | Promise<boolean> | boolean {    
    if(localStorage.getItem('digtrace')){
      this.router.navigateByUrl("/jobs")
      return false
    }
    else{
      return true
    }
  }
  
}
