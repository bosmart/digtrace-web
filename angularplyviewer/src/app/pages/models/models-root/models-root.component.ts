import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-models-root',
  templateUrl: './models-root.component.html',
  styleUrls: ['./models-root.component.css']
})
export class ModelsRootComponent implements OnInit {

  showSidebarBtn=false
  ngClassSidebar="col-lg-3 sidebarBefore"
  ngClassContent="col-lg-9 contentBefore"
  
  constructor() {}  
  ngOnInit(){}

  toggleBtnAction(){
    this.ngClassSidebar = "col-lg-0 sidebarAfter"
    this.ngClassContent = "col-lg-12 contentAfter"
    this.showSidebarBtn = true
  }

  closeSidebar(){
    this.ngClassSidebar="col-lg-3 sidebarBefore"
    this.ngClassContent="col-lg-9 contentBefore"
    this.showSidebarBtn=false
  }

}
