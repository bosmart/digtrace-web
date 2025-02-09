import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  data:any
  errorMsg
  

  constructor(private apiService:ApiService,private router:Router) { }  

  ngOnInit() {  
  }

  loginOnClick(username,password,loginCheck){
        
    let loginInfo = {
      username_email:username.value,
      password:password.value
    }       

    let headers= {
      "Content-Type":"application/json"
    }

    this.apiService.callApi('/api/user/login/','POST',JSON.stringify(loginInfo),headers,true)
    .subscribe({
        next: (res)=>{      
            this.setToken(res['token']['access'],res['username'],86400000)
            this.router.navigateByUrl('/')                            
        },
        error: (err)=>{
          if(err){
            this.errorMsg="Invalid username/password"
            console.log(err)
          }
        },
        complete:()=>console.log('Successfully Logged in')
    })          
  }
  
  setToken(token,userName,duration){
    let expiryDate = new Date().getTime() + duration
    let tokenData = {token,userName,expiryDate} 
    localStorage.setItem('digtrace',JSON.stringify(tokenData))                
  }

}
