import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-image-project-modal',
  templateUrl: './delete-image-project-modal.component.html',
  styleUrls: ['./delete-image-project-modal.component.css']
})
export class DeleteImageProjectModalComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<DeleteImageProjectModalComponent>, @Inject(MAT_DIALOG_DATA) public data: {deleteItem: string}){}

  ngOnInit() {
  }

  cancelModal(){
    this.dialogRef.close('cancel')
  }
  
  deleteItem(){
    this.dialogRef.close('confirm')
  }

}
