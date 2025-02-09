import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ConfirmJobSubmitComponent } from 'src/app/shared/components/confirm-job-submit/confirm-job-submit.component';
import { DeleteImageModalComponent } from 'src/app/shared/components/delete-image-modal/delete-image-modal.component';
import { DeleteJobModalComponent } from 'src/app/shared/components/delete-job-modal/delete-job-modal.component';


@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.css']
})
export class JobDescriptionComponent implements OnInit {  
  
  jobInfo   
  jobId
  jobSubmitErrors  
  showComponent
  errorMsg

  hPos:MatSnackBarHorizontalPosition = 'right'
  vPos:MatSnackBarVerticalPosition = 'bottom'

  constructor(private activatedRoute: ActivatedRoute,private apiService:ApiService,private router: Router,private snackBar:MatSnackBar, private dialog: MatDialog,private dataSharingService: DataSharingService) {}    

  apiRoot = this.apiService.apiRoot
  
  ngOnInit() {    
    this.activatedRoute.paramMap.subscribe(params=>{ 
      this.jobSubmitErrors = ""     
      this.jobId=params.get('id')
      this.apiService.callApi(`/api/job/${params.get('id')}/details/`)
        .subscribe({
            next:res=>{
              this.jobInfo=res['data']
              this.showComponent = res['code']==200 && true
            },
            error:res=>{
              this.errorMsg = res.error.errors[0]
              this.showComponent = false
            }
      })      
    })
  }

  jobSubmit(){    
    let headers = {"Content-Type":"application/json"}

    this.dialog.open(ConfirmJobSubmitComponent,{
      data:{        
        jobId: this.jobId
      }
    }).afterClosed()
    .subscribe(res=>{      
      if(res.value==='confirm'){
        let body = {
          "job_submit": res.checkValue,
          "job_id": this.jobId
        }
        this.apiService.callApi(`/api/job/${this.jobId}/submit/`,'POST',body,headers)
        .subscribe({
          next: res=>{
              this.snackBar.open('Job submission successful',"Dismiss",{
                duration:3000,
                horizontalPosition:this.hPos,
                verticalPosition:this.vPos,           
                panelClass:['snackbar-submit']         
              })
              this.apiService.callApi(`/api/job/${this.jobId}/details`)
              .subscribe({
                next:res=>{
                  this.showComponent = res['code']==200 && true
                  this.jobInfo = res['data']
                },
                error:res=>{                  
                  this.errorMsg = res.error.errors[0];
                  this.showComponent = false
                }
              })
          },
          error: res =>{            
            if(res['status']==400){
              this.jobSubmitErrors = res.error.errors
            }
            else{
              this.errorMsg = res.error.errors[0]
              this.showComponent = false
            }           
          }
        })
      }
    })
  }

  deleteJob(){
    this.dialog.open(DeleteJobModalComponent).afterClosed()
    .subscribe(res=>{
      if(res==='confirm'){
        this.apiService.callApi(`/api/job/${this.jobId}/delete/`,'DELETE')    
        .subscribe({
            next:res=>{
              this.snackBar.open('Job successfully deleted',"Dismiss",{
                duration:3000,
                horizontalPosition:this.hPos,
                verticalPosition:this.vPos,           
                panelClass:['snackbar-delete']         
              })       
                this.dataSharingService.changeData(`jobDeleted`)          
                this.router.navigate([`/jobs`])
            },
            error:res=>{
              this.snackBar.open(res.error.errors[0]+'!',"",{
                duration:1000,
                horizontalPosition:'center',
                verticalPosition:'bottom',           
                panelClass:['alert-warning','text-dark','snackbar-delete-denied']         
              })
            }
        })  
      }
    })      
  }  

  deleteImage(imageData){
    this.dialog.open(DeleteImageModalComponent).afterClosed()
    .subscribe(res=>{
      if(res==='confirm'){
        this.apiService.callApi(`/api/image-collection/image/${imageData.id}/delete/`,'DELETE')
        .subscribe({
          next:res=>{
            this.snackBar.open('Image successfully deleted',"Dismiss",{
              duration:3000,
              horizontalPosition:this.hPos,
              verticalPosition:this.vPos,           
              panelClass:['snackbar-delete']         
            })
            this.apiService.callApi(`/api/job/${this.jobId}/details/`)
              .subscribe({
                  next:res=>{
                    this.jobInfo=res['data']
                  },
                  error:res=>console.log(res)
              })    
            this.dataSharingService.changeData('imageDeleted')
          },
          error:res=>{
            this.snackBar.open(res.error.errors[0]+'!',"",{
              duration:1000,
              horizontalPosition:'center',
              verticalPosition:'bottom',           
              panelClass:['alert-warning','text-dark','snackbar-delete-denied']         
            })
          }
        })
      }
    })    
  }
}
