import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-change-image-info',
  templateUrl: './change-image-info.component.html',
  styleUrls: ['./change-image-info.component.css']
})
export class ChangeImageInfoComponent implements OnInit {
  
  changeInfoForm: FormGroup
  id
  allAlerts:boolean=false  
  showComponent
  errorMsg

  constructor(private fb:FormBuilder, private apiService: ApiService, private router:Router,private activatedRoute:ActivatedRoute, private dataSharingService: DataSharingService) {}

  ngOnInit(): void{              
    this.activatedRoute.paramMap.subscribe(params=>{
      this.id = params.get('id')

      this.changeInfoForm=this.fb.group({
        title: [[''],[Validators.required,Validators.minLength(1)]],
        description: [[''],[Validators.required,Validators.minLength(1)]]
      })
  
      this.apiService.callApi(`/api/image-collection/${this.id}/update/`)    
      .subscribe({
        next:res=>{
          this.changeInfoForm.patchValue({title:res['data'].title,description:res['data'].description})   
          this.showComponent = res['code'] == 200 && true
        },
        error:res=>{
          this.errorMsg = res.error.errors[0]
          this.showComponent=false
        }
      })
    })        
  }
  
  get title(){
    return this.changeInfoForm.get('title')  
  }

  get description(){
    return this.changeInfoForm.get('description')
  }

  onSubmit(){    

    if(this.changeInfoForm.invalid){
      this.allAlerts = true
      return null
    }    

    let body={
      title:this.title.value,
      description:this.description.value
    }
    this.apiService.callApi(`/api/image-collection/${this.id}/update/`,'PUT',body)
    .subscribe({
      next:res=>{                                        
            this.dataSharingService.changeData('imageInfoChanged')
            this.router.navigate([`images/view-images/${this.id}`])                      
          },             
      error:res=>console.error(res) 
    })
  }

}
