import { Component, OnInit } from '@angular/core';
import { Panel } from '../../../panel';
import { PANELS } from '../../../PANELS';

@Component({
  selector: 'app-plyviewer',
  templateUrl: './plyviewer.component.html',
  styleUrls: ['./plyviewer.component.css']
})
export class PlyviewerComponent  implements OnInit {
  
  panels = PANELS;
  selectedPanel: Panel;

  constructor(){}

  ngOnInit(){

    this.selectedPanel = PANELS[0];

  }

  onSelect(panel: Panel): void{

    this.selectedPanel = panel;
    
  }

}

