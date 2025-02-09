import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-project-library',
  templateUrl: './project-library.component.html',
  styleUrls: ['./project-library.component.css']
})

export class ProjectLibraryComponent implements OnInit {

  objectKeys = Object.keys;
  models = [];
  imgStyle = "0 5px";

  constructor( private data: DataService, public san: DomSanitizer ) { }

  ngOnInit() {

    this.data.currentMessage.subscribe( message => this.models = message );

  }

  setDragStart( event, dragId ){
    
    event.dataTransfer.setData( "dragId", dragId );

  }

  removeModel( key ){

    delete this.models[key];

  }

}
