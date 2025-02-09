import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-logout',
  templateUrl: './confirm-logout.component.html',
  styleUrls: ['./confirm-logout.component.css']
})
export class ConfirmLogoutComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ConfirmLogoutComponent>) { }

  ngOnInit() {
  }

  cancelModal(){
    this.dialogRef.close('cancel')
  }

  confirmModal()
  {
    this.dialogRef.close('confirm')    
  }

}
