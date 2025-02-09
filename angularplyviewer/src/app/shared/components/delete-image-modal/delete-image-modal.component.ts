import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-image-modal',
  templateUrl: './delete-image-modal.component.html',
  styleUrls: ['./delete-image-modal.component.css']
})
export class DeleteImageModalComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<DeleteImageModalComponent>, @Inject(MAT_DIALOG_DATA) public data: {deleteItem: string}){}

  ngOnInit() {
  }

  cancelModal(){
    this.dialogRef.close('cancel')
  }
  
  deleteItem(){
    this.dialogRef.close('confirm')
  }

}
