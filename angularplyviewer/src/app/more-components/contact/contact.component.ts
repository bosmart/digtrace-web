import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private apiService:ApiService) { }
  
  templates
  currentPage

  ngOnInit() {
    this.apiService.callApi('/digtrace/api/contacts/','GET',undefined,undefined,true)
    .subscribe(res=>{
      this.templates = res['data'].pages
      this.currentPage = this.templates[0].text    
      console.log(this.currentPage)  
    })
  }

}
