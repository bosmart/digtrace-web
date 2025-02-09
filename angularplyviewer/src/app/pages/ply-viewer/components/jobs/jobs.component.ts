import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';

const statusName = [
  "Cancelled/Failed",
  "In Progress",
  "Completed"
];

const statusCSS = [
  "failed",
  "progress",
  "completed"
];

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})

export class JobsComponent implements OnInit {

  jobs;  
  statusName = statusName;
  statusCSS = statusCSS;
  isOpen = false;

  constructor( private jobService: JobService ) { }

  ngOnInit() {

    this.getJobs();

  }

  getJobs(){

    this.jobService.getJobs().subscribe( jobs => this.jobs = jobs );

  }

  clearJobs(){

    this.jobService.clear().subscribe( jobs =>{
      
      this.jobs = jobs;
      
      if( this.jobs.length < 1 ){
        this.toggle();
      };

    });

  }

  cancelJob( job ){

    this.jobService.cancelJob( job );

  }
 
  toggle(){    
    this.isOpen = !this.isOpen;
  }

}
