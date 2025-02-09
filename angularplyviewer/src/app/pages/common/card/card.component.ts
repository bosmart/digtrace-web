import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { DeleteImageProjectModalComponent } from 'src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component';
import { DeleteJobModalComponent } from 'src/app/shared/components/delete-job-modal/delete-job-modal.component';
import { DjangoJobPlyService } from '../../ply-viewer/services/django-job-ply.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxNotificationService } from 'ngx-notification';
import { DataService } from '../../ply-viewer/services/data.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() data    
  message
  name
  modal

  constructor(private apiService:ApiService,private router:Router, private activatedRoute:ActivatedRoute,private snackBar:MatSnackBar, private djangoJobPlyService:DjangoJobPlyService,private ngxSpinnerService: NgxSpinnerService, private ngxNotificationService: NgxNotificationService,private dataService: DataService, private dialog: MatDialog, private dataSharingService: DataSharingService) {}  
  
  ngOnInit():void{
    this.name = this.data.job_name ? this.data.job_name : this.data.title
    this.modal = this.data.job_name ? DeleteJobModalComponent : DeleteImageProjectModalComponent       
  }
 
  apiRoot = this.apiService.apiRoot       
  hPos:MatSnackBarHorizontalPosition = 'right'
  vPos:MatSnackBarVerticalPosition = 'bottom'

  getPath(){
        return this.data.job_name                         
                           ? 
        {details:'jobs/job-description',delete:'job', edit:'jobs/update-job'}
                           : 
        {details:'images/view-images',delete:'image-collection',edit:'images/change-image-info'}
  }  

  showDetails(){    
     this.router.navigate([this.getPath().details+'/'+this.data.id], {relativeTo: this.activatedRoute.root})
  }   

  deleteItem(){
    this.dialog.open(this.modal,{
      data:{
        deleteItem:this.name
      }
    }).afterClosed()    
    .subscribe(res=>{
      if(res==='confirm'){
        this.apiService.callApi(`/api/${this.getPath().delete}/${this.data.id}/delete/`,'DELETE')
        .subscribe({
          next:res=>{
            this.snackBar.open(`${this.getPath().delete=="job" ? "Job" : "Image Collection"} successfully deleted`,"Dissmiss",{
              duration:3000,
              horizontalPosition:this.hPos,
              verticalPosition:this.vPos,           
              panelClass:['snackbar-delete']         
            })
            this.dataSharingService.changeData(`${this.getPath().delete}Deleted`)            
            if(this.router.url.split('/').pop() == this.data.id){
               this.router.navigateByUrl(`${this.data.job_name ? '/jobs' : '/images'}`)
            }
          },      
          error:res=>{
            this.snackBar.open(res.error.errors[0],"",{
              duration:1000,
              horizontalPosition:'center',
              verticalPosition:'bottom',           
              panelClass:['snackbar-delete']         
            })
          }
        }) 
      }       
    })            
  }

  editItem(){
    this.router.navigate([this.getPath().edit+'/'+this.data.id], {relativeTo: this.activatedRoute.root})
  }

  loadAction(){

    let navToPly = new Promise((resolve,reject)=>{      
        setTimeout(()=>resolve(this.data.job_status),1000)
    })

    if(this.data.job_name){               
      this.router.navigateByUrl('/jobs')   
      navToPly.then(res=>{        
        if( res == '224' || res == '225'){
          this.dataSharingService.changeData({jobId:this.data.id})
        }
        else{        
          this.dataSharingService.changeData({
            jobData:{
              id:this.data.id,
              status:this.data.job_status,
              name:this.data.job_name
            }
          })        
        } 
      })                 
    }
    else{         
      this.router.navigateByUrl('/jobs/create-job')   
      this.dataSharingService.changeData({imageId:this.data.id}) 
    }
  }
}


