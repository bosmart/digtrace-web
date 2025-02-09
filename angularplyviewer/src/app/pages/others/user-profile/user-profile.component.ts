import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  profileInfo
  
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.callApi(`/api/user/profile/`)
    .subscribe(res=>{
      this.profileInfo = res['data']
    })
  }

}
