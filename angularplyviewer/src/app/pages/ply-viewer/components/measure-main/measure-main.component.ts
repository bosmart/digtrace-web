import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../../services/data.service';
import { JobService } from '../../services/job.service';
import { ResizeEvent } from 'angular-resizable-element';
import Plotly from 'plotly.js-dist';

// Quick and dirty solution for compiling error
declare let require: any;

// Load threejs and PLY loader
// and numerical libraries
const THREE = require( 'three' );
const PLYLoader = require( 'three-ply-loader' );

@Component({

  selector: 'app-measure-main',
  templateUrl: './measure-main.component.html',
  styleUrls: ['./measure-main.component.css']
  
})

export class MeasureMainComponent implements OnInit {

  // View Queries on DOM
  @ViewChild('topMeasure') topMeasure;
  @ViewChild('mainview') mainview;
  @ViewChild('threeview') threeview;
  @ViewChild('importMeasure') importMeasure;

  // server side jobs
  jobs;
  
  // Models in the project area
  models = [];

  // Open choice
  precision = 0.50;
  scale = 2;

  fileType;
  colorScale = 'Jet';
  colorScales = [
    { name: 'Jet' },
    { name: 'Hot' },
    { name: 'Greys' },
    { name: 'Picnic' },
    { name: 'Earth' }
  ];

  // Save File Types
  fileTypes = [
    { name: "CSV" },
    { name: "ASC" }
  ];

  saveFileType = "CSV";
  saveFileName;

  // Opened model XYZ coordinates
  currentXYZ;

  // Interpolated data from server call
  // Structure is { X, Y, Z, XM and YM }
  currentXYZI;

  // Precision and scale for current model
  currentPrecision;
  currentScale;

  openXYZ;
  openXYZI;

  // File
  selectedFile: File;

  // Precisions and Scales
  precisions = [
    { name: 0.50 },
    { name: 1 }
  ];
  scales = [
    { id: 0, name: "mm" },
    { id: 1, name: "cm" },
    { id: 2, name: "dm" },
    { id: 3, name: "m" }
  ];

  gridScale = 2;
  gridDistance = 1;

  scaleBar = 1;

  inverted = 1;
  
  croppingStart = 0;
  croppingEnd = 1;
  croppingRange = [
    { id: 0 },
    { id: 1 }
  ];
  maxCrop = -1;

  flagCrop = false;
  flagLandmark = false;
  landmarks = [];
  landmarksXY = [];
  landmarkShapes = [];
  landmarkAnnotations = [];
  scaleShapes = [];
  scaleAnnotations = [];
  gridShapes = [];
  distanceTable = [];
  openPopupInfo = false;
  savePopUpInfo = false;
  flagMeasure = false;
  flagContour = false;
  flagContourCrop = false;
  flagScalebar = false;
  flagGrid = false;
  flagGridHover = false;
  distancesWidth;
  measurePopUpInfo = false;
  quickDistance;
  quickScale;

  depthGridValues;

  styleThreeView = { };
  styleOtherWindow = { };

  enableTools = {
    importFile : true,
    save: false,
    invert: false,
    autorotate: false,
    rotate90: false,
    mirror: false,
    crop: false,
    landmark: false,
    delete: false,
    distance: false,
    depth: false,
    measure: false,
    contour: false,
    contourtools: false,
    scale: false,
    grid: false
  }

  projectLibrary;

  constructor( private renderer: Renderer2, private data: DataService, private jobService: JobService){ }

  // Service for updating models array, used between compare and measure components
  ngOnInit(){
    
    this.data.currentMessage.subscribe( message => this.models = message );
    this.getJobs();

  }

  // Initialize PLY loader after component view has finished intialising
  ngAfterViewInit(){

    PLYLoader( THREE );

  }

  /*
   * Get all jobs
   *
   */
  getJobs(){

    this.jobService.getJobs().subscribe( jobs => this.jobs = jobs );

  }

  /*
   * Update job property
   *
   */
  updateJob( job ){

    this.jobService.updateJob( job );

  }

  /*
   * Callback after cancelling job
   *
   */
  cancelJobCallBack(){

    this.manageTools( true );

  }

  /*
   * Open file dialog
   *
   */ 
  openFileDialog(){

    if( !this.enableTools.importFile ) return true;

    this.importMeasure.nativeElement.click();

  }

  // When uploading file
  onFileChanged( event ){

    if( !this.enableTools.importFile ) return true;

    this.selectedFile = event.target.files[0];
    event.target.value = "";
    this.onUpload();

  }

  // Upload event
  onUpload(){

    let nameSplit = this.selectedFile.name.split( "." );
    let ext = nameSplit[ nameSplit.length - 1 ].toLowerCase();

    if( ext ){

      if( ext == "ply" ){

        this.fileType = "ply";
        this.openPopupInfo = true;

      }else if( ext == "csv" ){

        this.fileType = "csv";
        this.openPopupInfo = true;

      }else if( ext == "asc" ){

        this.fileType = "asc";
        this.openPopupInfo = true;

      }else{

        window.alert( "Only files with .ply, .csv and .asc extension are supported." );

      }

    }

  }

  /**
   * Open the selected model file.
   * 
   * Depending on file type store its XYZ coordinates.
   * Round up to 6 level.
   * 
   *  */
  doOpen(){

    // Hide popup open
    this.openPopupInfo = false;

    this.enableTools.importFile = false;

    // Reading PLY/CSV file notification
    this.jobService.notifyWithLoader( "Reading PLY/CSV file", 5000 );

    if( this.fileType == "ply" ){

      let loader = new THREE.PLYLoader();
      
      loader.load(
        window.URL.createObjectURL( this.selectedFile ),
        function( geometry ){
          
          let positionArray = geometry.getAttribute("position").array;
          this.openXYZ = [];
          
          for( let i = 0; i < positionArray.length; i = i+3 ){

            let x = Math.round( positionArray[i] * 1000000 ) /1000000;
            let y = Math.round( positionArray[i + 1] * 1000000 ) /1000000;
            let z = Math.round( positionArray[i + 2] * 1000000 ) /1000000;
            this.openXYZ.push( [ x, y, z ] );

          }

          // Interpolate after a successful coordinates reading
          this.interpolate();

          // Revoke temporary URL
          window.URL.revokeObjectURL( this.selectedFile );

        }.bind( this ),
        {
          indices: false,
          normals: false,
          uvs: false,
          colors: false
        },
        false,
        function(){

          this.enableTools.importFile = true;

        }.bind( this )
      );

    }else if( this.fileType == "csv" || this.fileType == "asc" ){

      var myReader:FileReader = new FileReader();
      
      // Use "any" remedy
      myReader.onload = function( e:any ){
        
        let csvText = e.target.result;
        let csvArray = csvText.split( "\n" );
        this.openXYZ = [];

        for( let i=1; i < csvArray.length; i++ ){

          let csvXYZ = csvArray[i].split( "," );

          if( csvXYZ[0] ){

            let x = Math.round( parseFloat( csvXYZ[0] ) * 1000000 ) /1000000;
            let y = Math.round( parseFloat( csvXYZ[1] ) * 1000000 ) /1000000;
            let z = Math.round( parseFloat( csvXYZ[2] ) * 1000000 ) /1000000;
            this.openXYZ.push( [ x, y , z ] );

          }

        }

        // Interpolate after a successful coordinates reading
        this.interpolate();

      }.bind( this );

      myReader.onerror = function( e:any ){

        this.enableTools.importFile = true;

      }.bind( this );

      myReader.readAsText( this.selectedFile );

    }

  }

  /**
   * Interpolate data through a sever call.
   * 
   */
  interpolate(){

    // Multiply dimensions with scale
    let multiplier = Math.pow( 10, this.scale );
    
    let postData = {
      
      method: "interpolate",
      data: this.openXYZ,
      precision: this.precision,
      multiplier: multiplier

    };

    // Call server side function with a job
    let job = {

      id: Math.random(),
      name: "2D Interpolation",
      status: 1,
      postData: postData,
      request: {},
      caller: this

    };

    // Call Interpolation method
    this.jobService.addJob(
      job,

      function( data ){

        if( typeof data == "string" ){

          job.status = 2;
          this.updateJob( job );

          // Store XYZI from interpolation
          this.openXYZI = this.jsonNaNValues( data );
          this.openXYZI = Object.values( this.openXYZI );

          this.enableTools.importFile = true;
          
          // Create a plotly diagram, create image snapshot and destroy diagram
          this.createImagePreview();

        }

      }.bind( this )

    );
    
  }

  /**
   * Create image preview of opened file.
   * 
   * Use plotly for diagram and then export image preview.
   * 
   *  */
  createImagePreview(){
    
    let trace = {
      
      z: this.openXYZI[2],
      type: 'heatmap',
      colorscale: "Jet",
      showscale: false
      
    };
    let data = [trace];

    Plotly.react( "plotTarget", data )
      .then(

        function( gd ){

          Plotly.toImage( gd, {

            format: "svg",
            height: 300,
            width: 300

          })
            .then(
              
              function( url ){

                let dragId = "plotImage_" + Math.random();
                
                // Append generated image and store opened model data
                let xyz = this.openXYZ;
                let xyzi = this.openXYZI;
                this.models[ dragId ] = [ xyz, xyzi, url, this.precision, this.scale ];
                this.data.changeMessage( this.models );
                
                // Purge model and set selected file to empty
                Plotly.purge( "plotTarget" );

              }.bind( this )

            )

        }.bind( this )

      );

  }

  /**
   *  Drop image event for generating 2d and 3d plots.
   *  
   */
  generatePanels( event ){

    // Disable tools before drawing anything
    this.manageTools( false );

    // Find dropped model
    let dragId = event.dataTransfer.getData("dragId");
    let currentModel = this.models[ dragId ];
    
    if( !currentModel ) return true;

    // Update XYZ, XYZI dimensions for current model
    this.currentXYZ = JSON.parse(JSON.stringify( currentModel[0] ));
    this.currentXYZI = JSON.parse(JSON.stringify( currentModel[1] ));
    this.currentPrecision = JSON.parse(JSON.stringify( currentModel[3] ));
    this.currentScale = JSON.parse(JSON.stringify( currentModel[4] ));

    // Remove previous plots
    Plotly.purge( "mainview" );
    Plotly.purge( "threeview" );

    // Reset invert
    this.inverted = 1;

    // Draw plots
    this.drawPlots();

    // Attach Events
    this.attachPlotEvents();

    // Set drop event for generated plot
    let plotChild = this.mainview.nativeElement.children[0];
    let dragover = this.renderer.listen( plotChild, "dragover", ( evt ) => { evt.preventDefault(); } );
    let drop = this.renderer.listen( plotChild, "drop", ( evt ) => {
      
      // Remove listeners
      drop();
      dragover();

      this.generatePanels( evt );

    } );

  }

  /**
   * Draw Plots
   * 
   */
  drawPlots(){

    // Remove previous shapes and annotations
    this.landmarks.length = 0;
    this.landmarksXY.length = 0;
    this.landmarkShapes.length = 0;
    this.landmarkAnnotations.length = 0;
    this.scaleShapes.length = 0;
    this.scaleAnnotations.length = 0;
    this.gridShapes.length = 0;

    // Draw 2D plot
    this.draw2DPlot();

  }

  /**
   * Draw 2D plot
   * 
   */
  draw2DPlot(){

    // 2D plot data
    let trace = {

      z: this.currentXYZI[2],
      type: 'heatmap',
      colorscale: this.colorScale,
      showscale: false
      
    };
    let data = [trace];

    // Create main plot and THEN
    // draw 3D panel
    Plotly.react(

        "mainview",
        data,
        {
          dragmode: "pan"
        },
        {
          toImageButtonOptions: {
            format: 'svg'
          },
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          doubleClick: false,
          editable: false,
          modeBarButtons: [ [ "toImage", "resetScale2d", "zoomIn2d", "zoomOut2d", "pan2d" ] ]
        }

      )
      .then(
        
        this.draw3DPlot()
        
      );
    
  }

  /**
   * Draw 3D plot
   * 
   */
  draw3DPlot(){

    // 3D interpolation data
    let postData = {

      method: "interpolate3D",
      data: this.currentXYZ,
      precision: this.currentPrecision

    };

    // Call server side function with a job
    let job = {

      id: Math.random(),
      name: "3D Interpolation",
      status: 1,
      postData: postData,
      request: {},
      caller: this

    };
    
    // Get Interpolated Data from server
    // and then create 3D plot
    this.jobService.addJob(
      job,
      function( data ){

        if( typeof data == "string" ){

          job.status = 2;
          this.updateJob( job );

          let jsonData = this.jsonNaNValues( data );
          
          // 3D plot
          let trace = {

              x: jsonData[0],
              y: jsonData[1],
              z: jsonData[2],
              type: 'surface',
              colorscale: this.colorScale,
              showscale: false

          };
          let data3d = [trace];
          
          // Draw 3D plot
          Plotly.react(

            "threeview",
            data3d,
            { },
            {
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ["sendDataToCloud", "toImage", "resetCameraLastSave3d"]
            }

          );
          
          this.manageTools( true );

        }

      }.bind( this )

    );

  }

  /**
   * Attach Plot Events
   * 
   */
  attachPlotEvents(){
    
    // Cropping Rectangular Event or Measure event
    this.mainview.nativeElement.on( 'plotly_selected', function( eventData ) {
      
      // Check if we can crop or not
      // or quick measure
      if( !this.flagCrop && !this.flagMeasure ) return;
      
      if( this.flagCrop ){

        this.manageTools( false );
      
        // New dimensions set by rectangular polygon
        this.rectCrop( eventData );

        // Reset Cropping Range
        this.calcContourCroppingRange();
        
        // Redraw plots
        this.drawPlots();

        // Reset cropping mode on diagram
        Plotly.relayout( "mainview" , {

          dragmode: "select"
    
        } );
        
      }else{

        this.quickMeasure( eventData );
        
      }

    }.bind( this ) );

    // Adding landmark event
    this.mainview.nativeElement.on( 'plotly_click', function( eventData ){
      
      if( !this.flagLandmark ) return true;

      // Update landmarks table and restyle plot
      this.updateLandmarks( eventData );

    }.bind( this ) );

    // Move landmark event
    this.mainview.nativeElement.on( 'plotly_relayout', function( eventData ){

      this.moveLandmark( eventData );
      
    }.bind( this ) );
    
  }

  /**
   *  Relayout event: Move landmark
   *  
   */
  moveLandmark( eventData ){
    
    // We only care about a moving landmark
    if( !eventData ) return true;
    if( eventData.annotations ) return true;

    for( let i = 0; i < this.landmarks.length; i++ ){

      // Get new X,Y dimensions
      let newX = Math.round( eventData["shapes[" + i + "].x0" ] * 100 ) / 100;
      let newY = Math.round( eventData["shapes[" + i + "].y0" ] * 100 ) / 100;

      if( newX && newY ){

        // Update landmarks, shapes and annotations arrays
        let z = this.landmarks[i][2];
        this.landmarks[i] = [ newX, newY, z ];
        this.landmarksXY[i] = [ newX, newY ];
        this.landmarkShapes[i].x0 = newX;
        this.landmarkShapes[i].y0 = newY;
        this.landmarkShapes[i].x1 = newX + 5;
        this.landmarkShapes[i].y1 = newY + 5;
        this.landmarkAnnotations[i].x = newX;
        this.landmarkAnnotations[i].y = newY + 15;

        // Update shapes and annotations
        Plotly.relayout( "mainview" , {

          shapes: this.landmarkShapes,
          annotations: this.landmarkAnnotations
    
        } );

        return true;
        
      }

    }

  }

  /**
   *  Show Save Pop Up
   *  
   */
  showSavePopUp(){

    if( !this.enableTools.save ) return true;

    this.savePopUpInfo = true;

  }

  /**
   *  Save file
   *  
   */
  doSaveAs(){
    
    if( !this.saveFileName ) return true;
    if( !this.currentXYZI ) return true;

    let option = "csv";

    if( this.saveFileType == "ASC" ){

      option = "asc";

    }

    let data = "X,Y,Z,\n";

    for( let i = 0; i < this.currentXYZ.length; i++ ){
      let currentVertice = this.currentXYZ[i];
      data += currentVertice[0] + "," + currentVertice[1] + "," + currentVertice[2] + ",\n";
    }

    this.createDownloadLink( data, this.saveFileName, option );

    this.savePopUpInfo = false;

  }

  /**
   *  Invert plots. 
   * 
   *  Skipping normalization from the server
   * 
   */
  invertPlots(){

    if( !this.enableTools.invert ) return true;
    if( !this.currentXYZI ) return true;
    
    this.manageTools( false );

    // Inverting Coordinates notification
    this.jobService.notifyWithLoader( "Inverting Coordinates", 5000 );

    // Invert XYZ
    for( let i = 0; i < this.currentXYZ.length; i++ ){

      this.currentXYZ[i][2] *= -1;

    } 

    // Invert XYZI
    this.currentXYZI[2] = this.currentXYZI[2].map( row => {

      return row.map( el => {

        if( el ) return ( el * -1 );

      });

    });

    this.inverted *= -1;

    // Draw the plots
    this.drawPlots();

  }

  /**
   *  Auto-Rotate
   *  
   */
  autoRotate(){

    if( !this.enableTools.autorotate ) return true;
    if( !this.currentXYZI ) return true;

    let postData = {

      method: "autoRotate",
      data: this.currentXYZ,
      precision: this.currentPrecision

    };

    // Call server side function with a job
    let job = {

      id: Math.random(),
      name: "Auto-Rotate",
      status: 1,
      postData: postData,
      request: {},
      caller: this

    };
    
    this.manageTools( false );

    this.jobService.addJob(

      job,

      function( data ){
        
        job.status = 2;
        this.updateJob( job );
        
        if( typeof data == "string" ){

          let jsonData = this.jsonNaNValues( data );

          this.currentXYZI[0] = jsonData[0];
          this.currentXYZI[1] = jsonData[1];
          this.currentXYZI[2] = jsonData[2];
          this.currentXYZI[3] = jsonData[3];
          this.currentXYZI[4] = jsonData[4];
          this.currentXYZ = jsonData["rotated_xyz"];

          this.drawPlots();

        }

      }.bind( this )

    );

  }

  /**
   *  Rotate by 90 degrees
   *  
   */
  rotate90(){

    if( !this.enableTools.rotate90 ) return true;
    if( !this.currentXYZI ) return true;

    let postData = {
      
      method: "rotate90",
      data: this.currentXYZI,
      precision: this.currentPrecision

    };

    this.manageTools( false );

    let job = {

      id: Math.random(),
      name: "Rotate by 90 Degress",
      status: 1,
      postData: postData,
      request: {},
      caller: this

    };

    this.jobService.addJob(

      job,

      function( data ){

        job.status = 2;
        this.updateJob( job );

        if( typeof data == "string" ){

          let jsonData = this.jsonNaNValues( data );

          this.currentXYZ = jsonData["xyz"];
          this.currentXYZI[0] = jsonData[0];
          this.currentXYZI[1] = jsonData[1];
          this.currentXYZI[2] = jsonData[2];
          this.currentXYZI[3] = jsonData[3];
          this.currentXYZI[4] = jsonData[4];

          this.drawPlots();

        }

      }.bind( this )

    );
  }

  /**
   *  Mirror Image
   *  
   */
  mirrorImage(){

    if( !this.enableTools.mirror ) return true;
    if( !this.currentXYZI ) return true;

    let postData = {
      
      method: "mirror",
      data: this.currentXYZI

    };

    this.manageTools( false );

    let job = {

      id: Math.random(),
      name: "Mirror Image",
      status: 1,
      postData: postData,
      request: {},
      caller: this

    };

    this.jobService.addJob(

      job,

      function( data ){

        job.status = 2;
        this.updateJob( job );

        if( typeof data == "string" ){

          let jsonData = this.jsonNaNValues( data );

          this.currentXYZ = jsonData["xyz"];
          this.currentXYZI[0] = jsonData[0];
          this.currentXYZI[1] = jsonData[1];
          this.currentXYZI[2] = jsonData[2];
          this.currentXYZI[3] = jsonData[3];
          this.currentXYZI[4] = jsonData[4];

          this.drawPlots();

        }

      }.bind( this )

    );

  }

  /**
   *  Rectangular Crop
   *  
   *  Update XYZ and XYZI structures before drawing plots
   */
  rectCrop( eventData ){

    if(  !eventData || !eventData.range ) return true;

    // Ranges of rectangular box
    let xBegin = Math.round( eventData.range.x[0] );
    let xEnd = Math.round( eventData.range.x[1] );
    let yBegin = Math.round( eventData.range.y[0] );
    let yEnd = Math.round( eventData.range.y[1] );

    let newX = [];
    let newY = [];
    let newZ = [];

    // Current interpolated X,Y,Z
    let interpolatedX = this.currentXYZI[0];
    let interpolatedY = this.currentXYZI[1];
    let interpolatedZ = this.currentXYZI[2];

    // Find the new coordinates from cropped rectangular
    for( let y = yBegin; y <= yEnd; y++ ){

      let xRow = [];
      let yRow = [];
      let zrow = [];

      for( let x = xBegin; x <= xEnd; x++ ){
        
        xRow.push( interpolatedX[y][x] );
        yRow.push( interpolatedY[y][x] );
        zrow.push( interpolatedZ[y][x] );

      }

      newX.push( xRow );
      newY.push( yRow );
      newZ.push( zrow );
      
    }

    // Update XYZI coordinates
    this.currentXYZI[0] = newX;
    this.currentXYZI[1] = newY;
    this.currentXYZI[2] = newZ;

    // Turn them to 1-D arrays
    let newX1d = [].concat.apply( [], newX );
    let newY1d = [].concat.apply( [], newY );
    let newZ1d = [].concat.apply( [], newZ );

    // Update XYZ coordinates
    let currentXYZ = [];
    for( let i = 0; i < newZ1d.length ;i++ ){

      currentXYZ.push( [ newX1d[i], newY1d[i], newZ1d[i] ] );

    }
    this.currentXYZ = currentXYZ;

  }

  /**
   *  Toggle cropping and update other configurations
   *  
   */
  toggleCropping(){

    if( !this.enableTools.crop ) return true;
    if( !this.currentXYZI ) return true;

    this.flagCrop = !this.flagCrop;

    // Set select mode bar on if we are going to crop
    let dragmode = "pan";
    if( this.flagCrop ){

      dragmode = "select";

    }

    // Disable other tools when cropping
    this.manageTools( true );
    if( this.flagCrop ){
      this.manageTools( false );
      this.enableTools.crop = true;
    }

    Plotly.relayout( "mainview" , {

      dragmode: dragmode

    } );

  }
  
  /**
   *  Toggle Landmarks
   *  
   */
  toggleLandmarks(){

    if( !this.enableTools.landmark ) return true;
    if( !this.currentXYZI ) return true;

    this.flagLandmark = !this.flagLandmark;

    // Enable all tools
    this.manageTools( true );

    // Editable when adding landmarks
    let editable = true;
    if( !this.flagLandmark ){
      editable = false;
    }

    let configOptions = {
      editable: editable,
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      doubleClick: false,
      modeBarButtons: [ [ "toImage", "resetScale2d", "zoomIn2d", "zoomOut2d", "pan2d" ] ]
    };

    let mainData = this.mainview.nativeElement.data;
    let mainLayout = this.mainview.nativeElement.layout;

    // Make plot editable or not
    Plotly.react(
      "mainview",
      mainData,
      mainLayout,
      configOptions
    );

    if( this.flagLandmark ){

      // Manage tools
      this.manageTools( false );
      this.enableTools.landmark = true;
      this.enableTools.delete = true;
      this.enableTools.distance = true;
      this.enableTools.depth = true;

    }

  }

  /**
   *  Update Landmakrs array and diagram
   *  
   */
  updateLandmarks( eventData ){

    // The coordinates of mouse clicking on the diagram
    let x = eventData.points[0].x;
    let y = eventData.points[0].y;
    let z = eventData.points[0].z;

    x = Math.round( x * 100 ) / 100;
    y = Math.round( y * 100 ) / 100;
    z = Math.round( z * 100 ) / 100;

    // Add landmark to table
    this.landmarks.push( [ x, y, z ] );
    this.landmarksXY.push( [ x, y ] );
    let landmark = this.landmarks[ this.landmarks.length - 1 ];

    // Store and show landmarks as circle on diagram
    this.landmarkShapes.push(

      {

        type: 'circle',
        xref: 'x',
        yref: 'y',
        fillcolor: 'black',
        x0: landmark[0],
        y0: landmark[1],
        x1: landmark[0] + 5,
        y1: landmark[1] + 5,
        line: {
          color: 'red'
        }

      }

    );

    // Annotations for each landmark
    this.landmarkAnnotations.push(

      {
        x: landmark[0],
        y: landmark[1] + 15,
        text: "L" + this.landmarks.length,
        showarrow: false,
        bgcolor: "white",
        font: {
          family: 'Courier New',
          color: "black",
          size: 23
        }
      }

    );

    // Relayout diagram
    Plotly.relayout( "mainview" , {

      shapes: this.landmarkShapes.concat( this.scaleShapes, this.gridShapes ),
      annotations: this.landmarkAnnotations.concat( this.scaleAnnotations )

    } );

  }
  
  /**
   *  Delete Landmakrs
   *  
   */
  delLandmarks(){

    if( !this.enableTools.delete ) return true;
    if( !this.currentXYZI ) return true;

    // Remove circles, landmarks and distances
    this.landmarks.length = 0;
    this.landmarksXY.length = 0;
    this.landmarkShapes.length = 0;
    this.landmarkAnnotations.length = 0;
    this.distanceTable.length = 0;

    // Relayout diagram
    Plotly.relayout( "mainview" , {

      shapes: this.landmarkShapes.concat( this.scaleShapes, this.gridShapes ),
      annotations: this.landmarkAnnotations.concat( this.scaleAnnotations )

    } );

  }

  /**
   *  Distances of Landmakrs
   *  
   */
  distanceLandmarks(){

    if( !this.enableTools.distance ) return true;
    if( !this.currentXYZI ) return true;
    if( this.landmarks.length <= 1 ) return true;

    // Reset distance table
    this.distanceTable.length = 0;

    // Go through each landmark and find its distance from other landmarks
    for( let i = 0; i < this.landmarks.length; i++ ){

      let distances = [];
      let firstLandmark = this.landmarks[i];

      for( let k = 0; k < this.landmarks.length; k++ ){

        let secondLandmark = this.landmarks[k];
        let distance = 0;

        // Distance between two Landmarks, zero for the same landmark
        if( k != i ) {

          let xs = secondLandmark[0] - firstLandmark[0];
          let ys = secondLandmark[1] - firstLandmark[1];
          xs *= xs;
          ys *= ys;
          
          distance = Math.sqrt( xs + ys );

        }

        distance = Math.round( distance * 100 ) / 100;
        distances.push( distance );

      }

      this.distanceTable.push( distances );
      this.distancesWidth = ( ( this.landmarks.length + 1 ) * 90 );

    }

  }

  /**
   *  Save Landmark Distances and coordinates
   *  
   */
  saveLandmarkDistances(){

    // Landmark Coordinates
    let data = "POINT ID,X,Y,Z,\n";
    for( let i = 0; i < this.landmarks.length; i++ ){

      let landmark = this.landmarks[i];
      data +=  "L" + (i+1) + "," + landmark[0] + "," + landmark[1] + "," + landmark[2] + ",\n";

    }

    data += "\n\n";

    // Distances 1st line
    data += "UID,";
    for( let i = 0; i < this.landmarks.length; i++ ){

      data += "L" + (i+1) + ",";

    }
    data += "\n";

    // Distances between landmarks
    for( let i = 0; i < this.distanceTable.length; i++ ){

      let distances = this.distanceTable[i];
      data += "L" + (i+1) + ",";
      distances.map( distance => data += distance + "," );
      data += "\n";

    }

    this.createDownloadLink( data, "Landmark Coordinates & Distances", "csv" );

  }

  /**
   *  Show Landmark Depth Chart
   *  
   *  It will show the depth chart from the landmarks we have previously added.
   */
  depthChart(){

    if( !this.enableTools.depth ) return true;
    if( !this.currentXYZI ) return true;
    if( this.landmarks.length < 2 ) return true;
    
    let postData = {
      
      method: "depthChart",
      data: JSON.stringify( this.currentXYZI ),
      landmarks: JSON.stringify( this.landmarksXY )

    };

    // Call server side function with a job
    let job = {

      id: Math.random(),
      name: "Depth Chart",
      status: 1,
      postData: postData,
      request: {},
      caller: this

    };
    
    this.manageTools( false );

    this.jobService.addJob(

      job,

      function( data ){

        if( typeof data == "string" ){

          job.status = 2;
          this.updateJob( job );

          this.manageTools( true );

          let jsonData = this.jsonNaNValues( data );

          this.depthGridValues = jsonData[0];
          let depthValues = jsonData[1];

          let x = [];
          while( x.length <= depthValues.length ){

            x.push( x.length );

          }

          let trace = {
      
            x: x,
            y: depthValues,
            type: 'scatter',
            
          };
          let plotData = [trace];
          
          // Create depth chart
          Plotly.react(
            "depthChart",
            plotData, 
            {
              width: 800,
              height: 350,
              dragmode: "pan"
            },
            {
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              doubleClick: false,
              modeBarButtons: [ [ "toImage", "resetScale2d", "zoomIn2d", "zoomOut2d", "pan2d" ] ]
            }
          );

        }

      }.bind( this )

    );

  }

  /**
   *  Save Depth Chart Points into CSV file
   *  
   */
  saveDetphChart(){

    let data = "X,Y,Z,\n";

    for( let i = 0; i < this.depthGridValues.length; i++ ){

      let currentVertice = this.depthGridValues[i];
      data += currentVertice[0] + "," + currentVertice[1] + "," + currentVertice[2] + ",\n";

    }

    this.createDownloadLink( data, "Depth Chart Values", "csv" );

  }

  /**
   *  Toggle Quick Measure
   *  
   */
  toggleQuickMeasure(){

    if( !this.enableTools.measure ) return true;
    if( !this.currentXYZI ) return true;

    this.flagMeasure = !this.flagMeasure;

    // Set select mode bar on if we are going to do quick measure
    let dragmode = "pan";
    if( this.flagMeasure ){

      dragmode = "select";

    }

    // Disable other tools
    this.manageTools( true );
    if( this.flagMeasure ){
      this.manageTools( false );
      this.enableTools.measure = true;
    }

    Plotly.relayout( "mainview" , {

      dragmode: dragmode

    } );

  }

  /**
   *  Quick Measure Calculation
   *  
   */
  quickMeasure( eventData ){

    if(  !eventData || !eventData.range ) return true;

    let xBegin = Math.round( eventData.range.x[0] );
    let xEnd = Math.round( eventData.range.x[1] );
    let dx = xEnd - xBegin;

    this.quickDistance = Math.hypot( dx );
    this.quickDistance = Math.round( this.quickDistance * 100 ) / 100;
    this.quickScale = this.scales[ this.currentScale ].name;

    this.measurePopUpInfo = true;

  }

  /**
   *  Toggle Contours
   *  
   */
  toggleContours(){

    if( !this.enableTools.contour ) return true;
    if( !this.currentXYZI ) return true;

    this.flagContour = !this.flagContour;

    if( this.flagContour ){

      let maxCrop = this.maxCrop;

      // Get Cropping range and maximum cropping value
      this.calcContourCroppingRange();

      // Set cropping end if we are 
      // loading contour for the first time
      if( maxCrop == -1 ){
        this.croppingEnd = this.maxCrop;
      }

      Plotly.restyle(
        "mainview",
        {
          type:"contour",
          contours: {
            start: this.croppingStart * this.inverted,
            end: this.croppingEnd * this.inverted,
            size: 1
          }
        }
      );

      // Disable other tools
      this.manageTools( false );
      this.enableTools.contour = true;
      this.enableTools.contourtools = true;
      
    }else{

      Plotly.restyle( "mainview", { type:"heatmap" } );
      this.manageTools( true );

    }

  }

  /**
   *  Show Contour Cropping Tools
   *  
   */
  showContourCrop(){

    if( !this.enableTools.contourtools ) return true;
    if( !this.currentXYZI ) return true;
    if( !this.flagContour ) return true;

    // Get Cropping range and maximum cropping value
    this.calcContourCroppingRange();

    this.flagContourCrop = !this.flagContourCrop;

    if( !this.flagContourCrop ){

      Plotly.restyle(
        "mainview",
        {
          type:"contour",
          contours: {
            start: this.croppingStart * this.inverted,
            end: this.croppingEnd * this.inverted,
            size: 1
          }
        }
      );
      
    }

  }

  /**
   *  Do Cropping
   *  
   */
  doContourCrop(){

    // Check cropping values
    if( this.croppingStart >= this.croppingEnd ){

      this.croppingStart = this.croppingEnd - 1;

      if( this.croppingStart < 0 ){

        this.croppingStart = 0;
        this.croppingEnd = 1;

      }

    }

    Plotly.restyle(
      "mainview",
      {
        type:"contour",
        contours: {
          start: this.croppingStart * this.inverted,
          end: this.croppingEnd * this.inverted,
          size: 1
        }
      }
    );

    this.flagContourCrop = false;

  }

  /**
   *  Get maximum contour cropping value,
   *  and set cropping range
   *  
   */
  calcContourCroppingRange(){

    // Maximum Crop
    this.maxCrop = 0;
    this.currentXYZI[2].forEach(element => {

      element.forEach(el => {

        let invertedElement = el * this.inverted;
        if( invertedElement > this.maxCrop ) this.maxCrop = invertedElement;

      });

    });

    this.maxCrop = Math.round( this.maxCrop );

    // Set Cropping Range
    this.croppingRange.length = 0;
    for( let i = 0; i <= this.maxCrop; i++ ){

      this.croppingRange.push( { id: i } );

    }

  }

  /**
   *  Toggle Scalebar
   *  
   */
  toggleScalebar(){

    if( !this.enableTools.scale ) return true;
    if( !this.currentXYZI ) return true;

    this.flagScalebar = !this.flagScalebar;

    this.scaleBar = this.currentPrecision / 1000 * Math.pow( 10, this.currentScale );
    this.scaleBar = 2 / this.scaleBar;

    if( this.flagScalebar ){

      let yAxisLength = this.currentXYZI[2].length;
      let xAxisLength = this.currentXYZI[2][0].length;

      this.scaleShapes = [
          {
            type: "rect",
            xref: 'x',
            yref: 'y',
            fillcolor: "gray",
            x0: xAxisLength - this.scaleBar,
            y0: yAxisLength - this.scaleBar/2,
            x1: xAxisLength,
            y1: yAxisLength,
            line: {
              width: 0
            }
          }
      ];

      this.scaleAnnotations = [
        {
          x: xAxisLength - this.scaleBar/2,
          y: yAxisLength - this.scaleBar/4,
          text: this.scaleBar,
          showarrow: false,
          font: {
            family: 'Courier New',
            color: "black",
            size: 23
          }
        }
      ];

      Plotly.relayout( "mainview", {
        shapes: this.scaleShapes.concat( this.landmarkShapes, this.gridShapes ),
        annotations: this.scaleAnnotations.concat( this.landmarkAnnotations )
      });

    }else{

      this.scaleShapes.length = 0;
      this.scaleAnnotations.length = 0;

      Plotly.relayout( "mainview",{
        shapes: this.scaleShapes.concat( this.landmarkShapes, this.gridShapes ),
        annotations: this.scaleAnnotations.concat( this.landmarkAnnotations )
      });
      
    }

  }

  /**
   *  Toggle Grid
   *  
   */
  toggleGrid(){

    if( !this.enableTools.grid ) return true;
    if( !this.currentXYZI ) return true;
    
    this.flagGridHover = !this.flagGridHover;

    if( !this.flagGridHover ){

      this.gridShapes.length = 0;
      
      Plotly.relayout( "mainview", {
        shapes: this.gridShapes.concat( this.landmarkShapes, this.scaleShapes )
      } );

    }else{

      this.flagGrid = !this.flagGrid;

    }
    
  }

  /**
   *  Close Grip PopUp
   *  
   */
  closeGripPopUp(){

    this.flagGrid = false;
    this.flagGridHover = false;
  }

  /**
   *  Validate Grid Distance
   *  
   */
  validateDistance(event:any){
    
    // Enter key
    if( event.keyCode == 13 ){

      this.addGrid();
      return true;

    }

    // Validation
    if( isNaN( event.target.value ) ){

      this.gridDistance = 1;

    }else{

      this.gridDistance = event.target.value;

    }

  }

  /**
   *  Add grid on top of diagram. (Shapes)
   *  
   *  Horizontal and Vertical lines are generated based 
   *  on the grid distance and precision set from the user
   */
  addGrid(){

    // Scale set from user prompt
    let scale = Math.pow( 10, this.gridScale );

    // Distance based on scale
    let gridDistance = this.gridDistance * scale;

    // Step of each grid axis
    let step = gridDistance / this.currentPrecision;

    // X and Y axis maximums
    let yLength = this.currentXYZI[2].length;
    let xLength = this.currentXYZI[2][0].length;

    // Build up origins of each vertical line
    let xSteps = [];
    for(let i = 0; i < xLength; i = i + step ){

      xSteps.push( i );

    }

    // Build up origins of each horizontal line
    let ySteps = [];
    for(let i = 0; i < yLength; i = i + step ){

      ySteps.push( i );

    }

    // Remove previous grid
    this.gridShapes.length = 0;

    // Create vertical lines
    for( let i = 0; i < xSteps.length; i++ ){
      let trace ={
        type: 'line',
        x0: xSteps[i],
        y0: 0,
        x1: xSteps[i],
        y1: yLength,
        line:{
          color: "white"
        }
      };
      this.gridShapes.push( trace );
    }

    // Create horizontal lines
    for( let i = 0; i < ySteps.length; i++ ){
      let trace ={
        type: 'line',
        x0: 0,
        y0: ySteps[i],
        x1: xLength,
        y1: ySteps[i],
        line:{
          color: "white"
        }
      };
      this.gridShapes.push( trace );
    }

    Plotly.relayout( "mainview", {
      shapes: this.gridShapes.concat( this.landmarkShapes, this.scaleShapes )
    } );
    
    this.flagGrid = false;

  }

  /**
   * Change Colour Scale
   * 
   * Supported by plotly: Greys,YlGnBu,Greens,YlOrRd,Bluered,RdBu,Reds,Blues,Picnic,Rainbow,Portland,Jet,Hot,Blackbody,Earth,Electric,Viridis,Cividis
   */
  changeColourScale(){
    
    if( this.currentXYZI && this.currentXYZ ){
      
      Plotly.restyle( "mainview" ,{

        colorscale: this.colorScale

      });

      Plotly.restyle( "threeview" ,{

        colorscale: this.colorScale

      });

    }

  }

  /**
   * Create Download link for save functionalities
   * 
   */
  createDownloadLink( data, filename, option ){

        // Create csv Blob data
    let blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });

    // Download link
    let dwldLink = document.createElement( "a" );
    let url = URL.createObjectURL( blob );

    //if Safari open in new window to save file with random filename.
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf( 'Chrome' ) == -1;

    if( isSafariBrowser ) {

      dwldLink.setAttribute("target", "_blank");

    }

    dwldLink.setAttribute( "href", url) ;
    dwldLink.setAttribute( "download",  filename + "." + option );
    dwldLink.style.visibility = "hidden";

    document.body.appendChild( dwldLink );
    dwldLink.click();
    document.body.removeChild( dwldLink );

  }

  /*
   * Enable or Disable All Tools
   *
   */
  manageTools( state ){

    Object.keys( this.enableTools ).forEach( key => {

      this.enableTools[key] = state;
      
    } );
    
  }

  /**
   * Set NaN values as they should be 
   * instead of strings when receiving 
   * data from server.
   * 
   */
  jsonNaNValues( data ){

    let result = JSON.parse(

      data.replace( /\bNaN\b/g, '"***NaN***"'),
        function( key, value ){

          return value === "***NaN***" ? NaN : value;

        }

    );

    return result;

  }

  /**
   * Resize First Model Window
   * 
   */
  onResizeEnd( event: ResizeEvent ){

    let topWidth = this.topMeasure.nativeElement.offsetWidth;
    let width = event.rectangle.width;
    let percentage =  100 * width / topWidth;
    
    // Limit from 60% to 80% width
    if( percentage > 80 ){

      percentage = 80;

    }else if( percentage < 60 ){

      percentage = 60;

    }
    
    // Apply style to main window
    this.mainview.nativeElement.style.width = percentage + "%";

    // Apply style on 3d view window
    this.threeview.nativeElement.style.width = (100 - percentage) + "%";

    // Re-adjust width for loaded model
    if( this.currentXYZI ){

      Plotly.relayout( "mainview", { width: this.mainview.nativeElement.offsetWidth } );
      Plotly.relayout( "threeview", { width: this.threeview.nativeElement.offsetWidth - 1 } );

    }

  }

}
