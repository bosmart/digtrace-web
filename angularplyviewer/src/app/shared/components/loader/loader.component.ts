import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { JobService } from 'src/app/pages/ply-viewer/services/job.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  notification:string=""
  time

  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private matDialogRef:MatDialogRef<LoaderComponent>) {    
  }

  ngOnInit() {    
      this.notification = this.data[0]
      if(this.data[1]>0){
        setTimeout(() => {
          this.matDialogRef.close()       
        }, +this.data[1])
      }           
  }

}
