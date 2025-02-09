import {Component, DoCheck, OnInit} from '@angular/core';
import {DjangoJobService} from "../../services/django-job.service";
import {MessageService} from "../../services/message.service";
import { environment } from "../../../../../environments/environment";


@Component({
  selector: 'app-django-jobs',
  templateUrl: './django-jobs.component.html',
  styleUrls: ['./django-jobs.component.css']
})


export class DjangoJobsComponent implements OnInit, DoCheck {
  public djangojobs;
    private message: any;
  private selectedIndex: number;
  public p: any;
  public config:any;
  public apiUrl:any;


  constructor(private _djangoJobService: DjangoJobService, private messageService: MessageService ) {
      this.apiUrl =environment['apiUrl']
  }
  ngDoCheck() {
      this.message = this.messageService.getMessage();

      if (this.message.toString() == 'refresh' && this.message!= ''){
          this.message = '';
          // this.getJobs();

}



  }


    ngOnInit() {
      this.message = '';

    this.getJobs();
    this.message = '';

    // this.data.currentMessage.subscribe(message => this.message = message)

  }


public setRow(_index: number) {
  this.selectedIndex = _index;}

  getJobs(){
    this._djangoJobService.list().subscribe(
        // the first argument is a function which runs on success
        data => {
          this.djangojobs = data;
          // convert the dates to a nice format
          for (let job of this.djangojobs) {
            job.date = new Date(job.job_date_created);
          }
        },
        // the second argument is a function which runs on error
        err => console.error(err),
        // the third argument is a function which runs on completion
        () => console.log('done loading posts')
    );
  }
  onFocus(){
          this.getJobs();

  }


  newMessage(message, status, name): void {
        // send message to subscribers via observable subject
        if (status=='224' || status=='225' ){
  this.messageService.sendMessage(message);
   }
        else{this.messageService.sendMessage(message.toString().concat('_status_'.concat(status).concat('_name_').concat(name)))}
  }

}