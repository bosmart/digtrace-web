import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import { ActivatedRoute, Router} from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { DeleteImageModalComponent } from 'src/app/shared/components/delete-image-modal/delete-image-modal.component';


@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private apiService:ApiService,private router:Router, private snackBar:MatSnackBar, private dialog: MatDialog, private dataSharingService: DataSharingService) { }

  apiRoot = this.apiService.apiRoot
  imageId
  imagesInfo  
  imagesCollection
  plyFileJobs
  hPos:MatSnackBarHorizontalPosition = 'right'
  vPos:MatSnackBarVerticalPosition = 'bottom'
  totalPages:number    
  itemActive
  showComponent
  errorMsg

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=>{ 
      this.imageId = params.get('id')     
      this.apiService.callApi(`/api/image-collection/${this.imageId}/details/`)
      .subscribe({
        next:res=>{          
          this.imagesInfo = res['data']['image_collection_data']
          this.imagesCollection= res['data']['images']
          this.plyFileJobs = res['data']['ply_file_jobs']
          this.totalPages = res['total_page_count']
          this.itemActive = 1  
          this.showComponent = res['code']==200 && true            
        },
        error:res=>{          
          this.errorMsg=res.error.errors[0]
          this.showComponent=false          
        }
      })      
    })    
  }         
  
  getThisPage(pageNum){
    if(pageNum !==this.itemActive){
      this.itemActive = pageNum
      this.getImageData(pageNum)      
    }    
  }

  getImageData(page){
    this.apiService.callApi(`/api/image-collection/${this.imageId}/details/?page=${page}`)
      .subscribe({
        next:res=>{          
          this.imagesCollection= res['data'].images
        },
        error:res=>console.log(res)
      })
  }

  deleteImage(imageData){
    this.dialog.open(DeleteImageModalComponent).afterClosed()
    .subscribe(res=>{
      if(res==='confirm'){
        this.apiService.callApi(`/api/image-collection/image/${imageData.id}/delete/`,'DELETE')
        .subscribe({
          next:res=>{
            this.snackBar.open('Image successfully deleted',"Dissmiss",{
              duration:3000,
              horizontalPosition:this.hPos,
              verticalPosition:this.vPos,           
              panelClass:['snackbar-delete']         
            })
            this.getImageData(this.itemActive)            
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
  
  createImageProjectJob(){
    this.router.navigateByUrl('/jobs/create-job')
    this.dataSharingService.changeData({imageId:this.imageId})   
  }

  getArray(val){
    let arr = []
    for(let i=1; i<=val; i++){
      arr.push(i)
    }
    return arr
  }
}
