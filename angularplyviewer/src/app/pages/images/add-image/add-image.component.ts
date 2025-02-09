import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.css']
})
export class AddImageComponent implements OnInit {

  imageUploadForm: FormGroup  
  imgCollectionId
  fileTypeCheck
  progressVal:number=0
  files:FileList
  errorMsg
  showComponent

  constructor(private fb:FormBuilder,private apiService:ApiService,private router:Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.imageUploadForm = this.fb.group({
      imageInput:[null]      
    })    
    this.activatedRoute.paramMap.subscribe(params=>{
      this.imgCollectionId = params.get('id')
      this.apiService.callApi(`/api/image-collection/${this.imgCollectionId}/update`)
      .subscribe({
        next:res=>{
          this.showComponent = res['code']==200 && true
        },
        error:res=>{
          this.errorMsg = res.error.errors[0]
          this.showComponent=false
        }
      })
    })
  }

  getImage(target:HTMLInputElement){  
    this.files = target.files        
    this.progressVal =0        
    
    this.imageUploadForm.patchValue({imageInput:this.files})
    this.imageInput.updateValueAndValidity()
  }

  get imageInput(){
    return this.imageUploadForm.get('imageInput')
  }

  uploadAgain(){
    this.router.routeReuseStrategy.shouldReuseRoute=()=>false
    this.router.onSameUrlNavigation = 'reload'
    this.router.navigateByUrl(this.router.url)         
  } 
  
  onSubmit(){        
      let fd:any = new FormData()    
      for(let file of this.imageInput.value){
        fd.append("images",file)    
      }        

      let otherOptions={
        reportProgress:true,
        observe:'events'
      }
      
      this.apiService.callApi(`/api/image-collection/${this.imgCollectionId}/image/add/`,'POST',fd,{},false,otherOptions)
      .subscribe((ab:ArrayBuffer)=>{                        
        let loadingRate = Math.round(ab['total'] && ab['loaded']*100/ab['total'])                
        if(loadingRate){
          this.progressVal = loadingRate          
        }    
        else if(ab['type']==4){                                                                                      
          this.router.navigateByUrl(`/images/view-images/${this.imgCollectionId}`)                      
        }                                               
      })           
  }  
}
