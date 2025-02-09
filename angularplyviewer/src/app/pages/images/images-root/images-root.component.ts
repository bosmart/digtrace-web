import { Component, OnInit } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-images-root',
  templateUrl: './images-root.component.html',
  styleUrls: ['./images-root.component.css']
})
export class ImagesRootComponent implements OnInit {

  showSidebarBtn=false
  ngClassSidebar="col-lg-3 sidebarBefore"
  ngClassContent="col-lg-9 contentBefore"

  constructor(private dataSharingService:DataSharingService) {}
  
  ngOnInit(): void {}

  toggleBtnAction(){
    this.ngClassSidebar = "col-lg-0 sidebarAfter"
    this.ngClassContent = "col-lg-12 contentAfter"
    this.showSidebarBtn = true
  }

  closeSidebar(){
    this.ngClassSidebar="col-lg-3 sidebarBefore"
    this.ngClassContent="col-lg-9 contentBefore"
    this.showSidebarBtn=false
    this.dataSharingService.changeData('toggleCanvasSize')
  }

}

