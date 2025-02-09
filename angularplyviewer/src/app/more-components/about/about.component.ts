import { Component, OnInit} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private apiService:ApiService) { }
  
  templates
  currentPage

  ngOnInit() {
    this.apiService.callApi('/digtrace/api/about/','GET',undefined,undefined,true)
    .subscribe(res=>{
      this.templates = res['data'].pages
      this.currentPage = this.templates[0].text    
      console.log(this.currentPage)  
    })
  }

}
