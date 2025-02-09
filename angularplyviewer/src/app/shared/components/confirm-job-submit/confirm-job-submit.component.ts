import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-confirm-job-submit',
  templateUrl: './confirm-job-submit.component.html',
  styleUrls: ['./confirm-job-submit.component.css']
})
export class ConfirmJobSubmitComponent implements OnInit {

  constructor(private apiService: ApiService,private dialogRef:MatDialogRef<ConfirmJobSubmitComponent>, @Inject(MAT_DIALOG_DATA) public data: {jobId: number}) {}
  
  submitCheck:boolean
  jobId
  submitModalErrors

  ngOnInit() {    
    this.jobId = this.data.jobId
    this.apiService.callApi(`/api/job/${this.jobId}/submit/`)
    .subscribe(res=>{
      this.submitCheck = res['data'].job_submit
      this.submitModalErrors = res["errors"]
    })
  }  

  cancelModal(){
    this.dialogRef.close({value:'cancel'})
  }
  
  confirmModal(){
    this.dialogRef.close({
      value:'confirm',
      checkValue: this.submitCheck
    })
  }
}
