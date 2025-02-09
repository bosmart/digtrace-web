import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {ErrorMessages} from './ErrorMessages'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],  
})

export class RegisterComponent implements OnInit {      
  
  registerForm
  allAlerts
  userInfo  
  errorMsgs:ErrorMessages={}

  constructor(private apiService:ApiService, private router:Router, private fb:FormBuilder) { }

  ngOnInit() {    
    this.registerForm = this.fb.group({
      firstName:[''],
      lastName:[''],
      userName:['',[Validators.required,Validators.minLength(1)]],
      email:['',[Validators.required,Validators.minLength(1)]],
      password:['',[Validators.required,Validators.minLength(1)]],
      confirmPassword:['',[Validators.required,Validators.minLength(1)]],
      institute:['', [Validators.required,Validators.minLength(1)]],
      registerCheck:[false,[Validators.required,Validators.requiredTrue]]
    })
  }

  get userName(){
    return this.registerForm.get('userName')
  }

  get email(){
    return this.registerForm.get('email')
  }

  get password(){
    return this.registerForm.get('password')
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword')
  }

  get institute(){
    return this.registerForm.get('institute')
  }

  get registerCheck(){
    return this.registerForm.get('registerCheck')
  }

  registerOnSubmit(){
    this.errorMsgs.userName = ''
    this.errorMsgs.email = ''

    if(this.registerForm.invalid){      
      this.allAlerts = true      
      return null
    }

    this.userInfo = {
      first_name:this.registerForm.value.firstName,
      last_name:this.registerForm.value.lastName,
      username:this.registerForm.value.userName,
      email:this.registerForm.value.email,
      password:this.registerForm.value.password,
      institute:this.registerForm.value.institute
    }

    let headers= {
      "Content-Type":"application/json"
    }
             
    this.apiService.callApi('/api/user/register/','POST',JSON.stringify(this.userInfo),headers,true)      
    .subscribe(
      {
        next:(res)=>{                                           
          this.router.navigateByUrl('auth/login')
        },
        error:(res)=>{       
          let errors = res.error.errors

          this.errorMsgs={
            userName: errors.username ? errors.username[0] : '',
            email:errors.email ? errors.email[0] : '',
            password:errors.password ? errors.password[0] : '',
            confirmPassword: errors.confirmPassword ? errors.confirmPassword[0] : '',
            institute:errors.institute ? errors.institute[0] : '',
            registerCheck:errors.registerCheck ? errors.registerCheck[0] : ''
          }          
        },
        complete:()=>{            
          console.log('Registration Complete')
        }
      }
    ) 
  }
} 
