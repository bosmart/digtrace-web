import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  token:string
  errorMessage:any
  successMessage:any
  buttonDisable:boolean = false
  alertMessage: any

  constructor(private apiService:ApiService,private router:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      this.token = params.get('token')
    })
  }

  checkPassword(password:any, re_password:any){
    if(password.value != re_password.value && re_password != ""){
        this.alertMessage = "password doesn't match"
    }
    else{
      this.alertMessage = null
    }
  }

  setNewPassword(password:any, re_password:any){
      this.errorMessage = null
      this.successMessage = null
      this.buttonDisable = true

      let data = {
          password: password.value,
          re_password: re_password.value
      }       

      console.log(this.token)
      console.log(data)

      let headers= {
          "Authorization": "Bearer " + this.token,
          "Content-Type":"application/json"
      }

      this.apiService.callApi('/api/user/change-password/','POST',JSON.stringify(data),headers,true)
      .subscribe({
          next: (response)=>{                  
              console.log(response)
              this.successMessage = response["message"]

              // localStorage.setItem('digtrace',JSON.stringify({token:res["token"]["access"],username:res["username"]}))
              // this.router.navigateByUrl('/')                            
          },
          error: (response)=>{
              console.log(response)

              if(response){
                  if(response.status == 401){
                    this.errorMessage = "Your password-reset link is not valid"
                  }

                  else {
                    this.errorMessage = response.error["errors"][0]
                    console.log(response.error)
                    this.buttonDisable = false
                  }
              }
          },
          complete:()=>console.log('Password updated successfully')
      })          
  }
}
