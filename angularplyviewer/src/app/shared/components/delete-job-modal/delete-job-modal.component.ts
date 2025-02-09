import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-job-modal',
  templateUrl: './delete-job-modal.component.html',
  styleUrls: ['./delete-job-modal.component.css']
})
export class DeleteJobModalComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<DeleteJobModalComponent>, @Inject(MAT_DIALOG_DATA) public data: {deleteItem: string}){}

  ngOnInit() {
  }

  cancelModal(){
    this.dialogRef.close('cancel')
  }
  
  deleteItem(){
    this.dialogRef.close('confirm')
  }


}
