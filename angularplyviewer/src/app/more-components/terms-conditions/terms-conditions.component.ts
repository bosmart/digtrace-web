import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit{

  constructor(private apiService:ApiService) { }
  
  templates
  currentPage

  ngOnInit() {
    this.apiService.callApi('/digtrace/api/terms-conditions/','GET',undefined,undefined,true)
    .subscribe(res=>{
      this.templates = res['data'].pages
      this.currentPage = this.templates[0].text             
    })
  }  
}
