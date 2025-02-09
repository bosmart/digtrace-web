import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatDividerModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatButtonToggleModule } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({  
  exports:[
    MatProgressBarModule,
    MatSnackBarModule,  
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatDividerModule
  ]
})
export class MatSharedModule { }
