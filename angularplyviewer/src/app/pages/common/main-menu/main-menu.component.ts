import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmLogoutComponent } from 'src/app/shared/components/confirm-logout/confirm-logout.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(private dialog: MatDialog,private router:Router) { }  

  username
  
  ngOnInit() {    
    this.username = JSON.parse(localStorage.getItem('digtrace')).userName
  }

  logOut(){        
    this.dialog.open(ConfirmLogoutComponent).afterClosed()
    .subscribe({      
      next:res=>{
        if(res=="confirm"){
          localStorage.removeItem('digtrace')
          this.router.navigateByUrl('/auth/login')
        }
      },
      error:res=>{
        console.log(res)
      }
    })    
  }

}
