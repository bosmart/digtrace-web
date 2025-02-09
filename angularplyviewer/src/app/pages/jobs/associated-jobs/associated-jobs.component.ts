import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ConfirmJobSubmitComponent } from 'src/app/shared/components/confirm-job-submit/confirm-job-submit.component';
import { DeleteJobModalComponent } from 'src/app/shared/components/delete-job-modal/delete-job-modal.component';

@Component({
  selector: 'app-associated-jobs',
  templateUrl: './associated-jobs.component.html',
  styleUrls: ['./associated-jobs.component.css']
})
export class AssociatedJobsComponent implements OnInit {

  jobId
  groupJobsInfo
  totalPageCount
  itemActive
  totalItems
  apiRoot
  showComponent
  errorMsg
  jobSubmitErrors

  constructor(private apiService:ApiService, private router:Router, private activatedRoute: ActivatedRoute, private snackBar:MatSnackBar, private dialog: MatDialog,private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.apiRoot = this.apiService.apiRoot
    this.activatedRoute.paramMap.subscribe(params=>{
      this.jobId=params.get('id')
      this.apiService.callApi(`/api/job/${this.jobId}/group-jobs/`)
      .subscribe({
          next:res=>{
               this.groupJobsInfo = res['data']
               this.showComponent = res['code']==200 && true      
          },
          error:res=>{
            this.errorMsg=res.error.errors[0]
            this.showComponent=false
          }
       })
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
                horizontalPosition:'right',
                verticalPosition:'bottom',           
                panelClass:['snackbar-delete']         
              })          
              this.dataSharingService.changeData('jobDeleted')                    
              this.apiService.callApi(`/api/job/${this.jobId}/group-jobs/`)
              .subscribe(res=>{
                this.groupJobsInfo = res['data']                
              })              
            },
            error:res=>console.log(res)
        })  
      }
    })      
  }  

  jobSubmit(job){    
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
                horizontalPosition:'center',
                verticalPosition:'bottom',           
                panelClass:['snackbar-submit']         
              })              
              this.router.navigateByUrl(`/jobs/job-description/${this.jobId}`)
          },
          error: res =>{
            this.jobSubmitErrors = res.error.errors        
            window.scroll(0,0)    
          }
        })
      }
    })
  }

}
