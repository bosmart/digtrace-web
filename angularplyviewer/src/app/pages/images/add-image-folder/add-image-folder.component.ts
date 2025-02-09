import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-add-image-folder',
  templateUrl: './add-image-folder.component.html',
  styleUrls: ['./add-image-folder.component.css']
})
export class AddImageFolderComponent implements OnInit {                         

    folderUpForm: FormGroup 
    files:FileList 
    fileNames    
    fileTypeCheck    
    directories={}  
    progressVal:number=0  
    rootDir
    subDir
    errorMsgs
    createdJobId
    
    constructor(private fb:FormBuilder, private apiService: ApiService, private router:Router) { } 
  
    ngOnInit(): void {
      this.folderUpForm=this.fb.group({
        title:[''],
        description:[''],        
        imageFolder:[null,[Validators.required]]
      })
    }                 

    getImageFolder(target: HTMLInputElement){          
      this.files = target.files      
      let regex:RegExp = /png|jpeg|jpg|bmp/i
      this.fileTypeCheck = true
      this.directories = {}
      this.fileNames = [] 
      this.progressVal=0           
      this.subDir = []

      for(let i=0; i<this.files.length; i++){                             
        this.fileTypeCheck = regex.test(this.files[i].type.split('/').pop())  
        if(this.fileTypeCheck==false){          
          return null
        }                
        this.directories[`${i}_${this.files[i].name}`] = this.files[i]['webkitRelativePath']         
      }
      
      this.fileNames = Object.values(this.directories)      
      this.rootDir = this.fileNames[0].split('/')[0]
      this.subDir = this.fileNames.filter(item=>{
        if(item.split('/').length > 2){          
          return item.split('/')[1]
        }        
      })
      .map(item=>item.split('/')[1])
      .filter((item,index,arr)=>{
          return item != arr[index-1] && item
      })      
      
      this.folderUpForm.patchValue({
        imageFolder:this.files
      });
      this.imageFolder.updateValueAndValidity()                
    }

    get title(){
      return this.folderUpForm.get('title')
    }

    get description(){
      return this.folderUpForm.get('description')
    }

    get imageFolder(){
      return this.folderUpForm.get('imageFolder')
    }

    onSubmit(){      
      if(this.fileTypeCheck){
          let formData:any = new FormData()
          formData.append("title",this.title.value)
          formData.append("description",this.description.value)  
          formData.append("directories",JSON.stringify(this.directories))  

          for(let file of this.imageFolder.value){
            formData.append("file_field",file)      
          }   

          let otherOptions={
            reportProgress:true,
            observe:'events'
          }

          this.apiService.callApi('/api/image-collection/create/','POST',formData,{},false,otherOptions)
          .subscribe({
            next:(ab:ArrayBuffer)=>{                          
                let loadingRate = Math.round(ab['total'] && ab['loaded']*100/ab['total'])                   
                if(loadingRate){
                  this.progressVal = loadingRate                  
                }                 
                if(ab['type']==4){
                  this.createdJobId = ab['body'].data.job_id
                                    
                  if(this.createdJobId){                    
                    this.router.navigateByUrl(`/jobs/job-description/${ab['body'].data.job_id}`)                       
                  }        
                  else{
                    this.errorMsgs = ['job not created']
                  }          
                }
            }            
          })
      }           
    } 
    
    uploadMore(){
      this.router.routeReuseStrategy.shouldReuseRoute=()=>false
      this.router.onSameUrlNavigation = 'reload'
      this.router.navigateByUrl(this.router.url)         
    }
}