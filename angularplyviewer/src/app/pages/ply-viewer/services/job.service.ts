import { Injectable } from '@angular/core';
import {HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Job } from '../../../job';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';


@Injectable({
  
  providedIn: 'root'

})

export class JobService {

  // This URL should be replaced with 
  // the server that will be used later
  // For the moment call callpy.py file with Flask
  private pythonURL = '/test_api/'
  dialogRef
  jobs: Job[] = [];  

  constructor( private dialog: MatDialog,private apiService:ApiService,private snackBar:MatSnackBar) { }

  clear(): Observable<Job[]>{

    let jobs:Job[] = [];

    this.jobs.map( job =>{
      if( job.status == 1 ){
        jobs.push( job );
      }
    });

    this.jobs = jobs;
    return of( this.jobs );
  }

  getJobs(): Observable<Job[]>{
    return of( this.jobs );
  }
  
  addJob( job: Job, callback ){    

    let headers= {
      "Content-Type":"application/json"
    }      

    job.request = this.apiService.callApi(this.pythonURL,'POST', JSON.stringify(job.postData), headers)
                  .subscribe( callback, 
                              error => {
                                this.handleError( error, job )
                                this.dialogRef.close()
                              },
                              () => this.dialogRef.close()
                  );
    
    this.dialogRef = this.dialog.open(LoaderComponent,{
      disableClose:true,     
      data:["Loading...",-1]
    })
                  
    this.jobs.push( job );
    this.sortJobs();   
    
    this.snackBar.open("Job Added in Ply Viewer",'dismiss',{
      duration:2000,
      horizontalPosition:'right',
      verticalPosition:'bottom',           
      panelClass:['snack-ply-job-added']  
    })
  }
  
  notifyWithLoader( text, time ){    
    this.dialog.open(LoaderComponent,{
      disableClose:true,      
      data:[text,time]
    })    
  }

  updateJob( job: Job ){
    this.jobs.map( ( element, index ) => {
      if( element.id == job.id ){
        this.jobs[index] = job;
      }
    });
    this.sortJobs();
  }

  cancelJob( job: Job ){    
    // Cancel server call and execute callback
    job.request.unsubscribe();
    job.caller.cancelJobCallBack();
    // Set status to 0
    job.status = 0;
    this.updateJob( job );
  }

  private sortJobs(){
    this.jobs = this.jobs.sort(function( a, b ){
      let x = a.status;
      let y = b.status;

      if( x == 1 && y == 1 ){
        return 0;
      }
      if( x == 1 && y != 1 ){
        return -1;
      }
      if( x != 1 && y == 1 ){
        return 1;
      }
    });
  }

  private handleError(error: HttpErrorResponse, job: Job) {
    // A client-side or network error occurred. Handle it accordingly.
    // Else,
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,    
    if( error.error instanceof ErrorEvent ){
      console.error( 'An error occurred:', error.error.message );
    }
    else{    
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );      
    }    
    this.cancelJob( job );
    window.alert( 'Something bad happened; please check the browser console for details.' );
  };

}
