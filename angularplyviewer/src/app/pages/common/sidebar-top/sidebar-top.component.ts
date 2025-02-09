import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';


@Component({
  selector: 'app-sidebar-top',
  templateUrl: './sidebar-top.component.html',
  styleUrls: ['./sidebar-top.component.css']
})

export class SidebarTopComponent implements OnInit {

  @Input() listType
  @Input() plusBtnPath
  @Output() onSearchFilter = new EventEmitter();

  order:string="image-upload-date"
  sort:string="recent"
  searchInput:string=""  
  filterBtnPosition='35px'
  
  sortUpDown:boolean = true
  searchBtnDisplay:boolean = true
  searchFormDisplay:boolean = false
  filterBtnDisplay:boolean = true
  sortListDisplay:boolean = false
  sortUpBtnDisplay:boolean = false
  sortDownBtnDisplay:boolean = true
  addBtnDisplay:boolean = true

  constructor(private router: Router,private dataSharingService: DataSharingService) { }

  ngOnInit() {}
  
  search(inputVal){
      this.searchInput = inputVal.value      
      this.onSearchFilter.emit(`?order-by=${this.order}&sort-by=${this.sort}&search-text=${this.searchInput}`)
  }

  pressFilterOption(orderBy){
    this.pressFilterBtn()
    this.order = orderBy    
    this.onSearchFilter.emit(`?order-by=${this.order}&sort-by=${this.sort}&search-text=${this.searchInput}`)
  }  

  pressSearchBtn(){
    this.searchFormDisplay = !this.searchFormDisplay
    this.filterBtnDisplay = !this.filterBtnDisplay   
    this.addBtnDisplay = !this.addBtnDisplay  
    this.sortUpDown = !this.sortUpDown 
  }

  pressFilterBtn(){
    this.searchBtnDisplay = !this.searchBtnDisplay 
    this.sortListDisplay = !this.sortListDisplay    
    this.addBtnDisplay = !this.addBtnDisplay
    this.sortUpDown = !this.sortUpDown
    this.dataSharingService.changeData('pressFilterBtn')
    if(this.filterBtnPosition=='35px'){
      this.filterBtnPosition = '12px'
    }
    else{
      this.filterBtnPosition = '35px'
    }
  }

  pressSortUpBtn(){
    this.sortUpBtnDisplay = false
    this.sortDownBtnDisplay = true
    this.sort = 'recent'
    this.onSearchFilter.emit(`?order-by=${this.order}&sort-by=${this.sort}&search-text=${this.searchInput}`)
  }

  pressSortDownBtn(){
    this.sortDownBtnDisplay = false
    this.sortUpBtnDisplay = true
    this.sort = 'oldest'
    this.onSearchFilter.emit(`?order-by=${this.order}&sort-by=${this.sort}&search-text=${this.searchInput}`)
  }

  pressAddBtn(){
    this.router.navigateByUrl(this.plusBtnPath)
  }  

}
