import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

    data:any
    errorMessage:string
    successMessage:string
    buttonDisable:boolean = false

    constructor(private apiService:ApiService,private router:Router) { }

    sendResetPasswordMail(email:any){
        this.errorMessage = null
        this.successMessage = null
        this.buttonDisable = true

        let data = {
            email:email.value,
        }       

        let headers= {
            "Content-Type":"application/json"
        }

        this.apiService.callApi('/api/user/reset-password/','POST',JSON.stringify(data),headers,true)
        .subscribe({
            next: (response)=>{                  
                console.log(response)
                this.successMessage = response["message"]

                // localStorage.setItem('digtrace',JSON.stringify({token:res["token"]["access"],username:res["username"]}))
                // this.router.navigateByUrl('/')                            
            },
            error: (response)=>{
                if(response){
                    this.errorMessage = response.error["errors"][0]
                    console.log(response.error)
                    this.buttonDisable = false
                }
            },
            complete:()=>console.log('A password reset link sent to your email')
        })          
    }
  
    ngOnInit() {  
    }
}
