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

  selector: 'app-compare-main',
  templateUrl: './compare-main.component.html',
  styleUrls: ['./compare-main.component.css']

})

export class CompareMainComponent implements OnInit {

  @ViewChild('firstModel') firstModel; 
  @ViewChild('secondModel') secondModel;
  @ViewChild('contourArea') contourArea;
  @ViewChild('topCompare') topCompare;
  @ViewChild('comparison') comparison;
  @ViewChild('importCompare') importCompare;

  // Files
  files;
  loadingFiles = 0;
  filesLength = 0;

  // Server side job services
  jobs;

  saveFileName;
  savePopUpInfo;

  colorScale = 'Jet';
  colorScales = [
    { name: 'Jet' },
    { name: 'Hot' },
    { name: 'Greys' },
    { name: 'Picnic' },
    { name: 'Earth' }
  ];

  openPopupInfo = false;
  flagLandmark = false;
  flagMeasure = false;
  loading = false;

  // Generated Contour
  generatedContour = false;

  // Generating Contour
  generatingContour = false;

  // Open choice
  precision = 0.50;
  scale = 2;

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

  // Transformation choice
  transformation = 1;
  transformations = [
    { id: 0, name: "Affine Transformation" },
    { id: 1, name: "Rigid Transformation" }
  ];

  // Geometry options for landmarks
  line = false;
  triangle = false;
  circle = false;

  firstCurrentXYZ;
  firstCurrentXYZI;
  secondCurrentXYZ;
  secondCurrentXYZI;
  
  firstLandmarks = [];
  firstShapes = [];
  firstAnnotations = [];
  firstA = [ [1,0], [0,1], [0,0] ];
  secondLandmarks = [];
  secondShapes = [];
  secondAnnotations = [];
  secondA = [];

  quickDistance
  quickScale;
  measurePopUpInfo;

  // Used when adding or removing contours levels
  contourLines = 0;

  // XYZ and XYZI when opening a model
  openXYZ;
  openXYZI;

  models = [];
  targetArea;
  projectLibrary;
  objectKeys = Object.keys;

  contourError;

  // Main windows styles
  styleComparison = {};
  styleOtherWindow = {};

  enableTools = {
    importFiles: true,
    export: false,
    landmark: false,
    delete: false,
    measure: false,
    contourTools: false
  };

  constructor(private renderer: Renderer2, private data: DataService, private jobService: JobService) { }

  ngOnInit(){
    
    this.data.currentMessage.subscribe( message => this.models = message );
    this.getJobs();

  }

  ngAfterViewInit(){

    PLYLoader( THREE );

  }

  /*
   * Open file dialog
   *
   */ 
  openFileDialog(){

    if( !this.enableTools.importFiles ) return true;

    this.importCompare.nativeElement.click();

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
    this.generatingContour = false;

  }

  // When uploading file
  onFileChanged( event ){

    // File list
    this.files = Object.assign({}, event.target.files);
    this.files.length = event.target.files.length;
    this.filesLength = this.files.length;

    // Open dialog
    this.openPopupInfo = true;

    // Set input file value to null
    event.target.value = "";

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
    
    this.enableTools.importFiles = false;

    let unsupported = false;

    this.jobService.notifyWithLoader( "Reading PLY/CSV Files", 5000 );

    for( let i = 0; i < this.files.length; i++ ){

      let file = this.files[i];
      let nameSplit = file.name.split( "." );
      let ext = nameSplit[ nameSplit.length - 1 ].toLowerCase();
      
      if( ext == "ply" ){

        let loader = new THREE.PLYLoader();
        
        loader.load(
          window.URL.createObjectURL( file ),
          function( geometry ){
            
            let positionArray = geometry.getAttribute("position").array;
            this.openXYZ = [];
            
            for( let i = 0; i < positionArray.length; i = i+3 ){

              let x = Math.round( positionArray[i] * 1000000 ) /1000000;
              let y = Math.round( positionArray[i + 1] * 1000000 ) /1000000;
              let z = Math.round( positionArray[i + 2] * 1000000 ) /1000000;
              this.openXYZ.push( [ x, y, z ] );

            }

            this.interpolate();

            // Revoke temporary URL
            window.URL.revokeObjectURL( file );

          }.bind( this ),
          {
            indices: false,
            normals: false,
            uvs: false,
            colors: false
          },
          false,
          function(){
  
            this.enableTools.importFiles = true;
  
          }.bind( this )
        );          

      }else if( ext == "csv" ){

        var myReader:FileReader = new FileReader();
        
        // Use "any" remedy
        myReader.onload = function( e:any ){
          
          let csvText = e.target.result;
          let csvArray = csvText.split( "\n" );
          this.openXYZ = [];

          for( let i=1; i < csvArray.length; i++ ){

            let csvXYZ = csvArray[i].split( "," );

            if( csvXYZ[0] ){

              let x = Math.round( csvXYZ[0] * 1000000 ) /1000000;
              let y = Math.round( csvXYZ[1] * 1000000 ) /1000000;
              let z = Math.round( csvXYZ[2] * 1000000 ) /1000000;
              this.openXYZ.push( [ x, y , z ] );

            }

          }

          this.interpolate();

        }.bind( this );

        myReader.onerror = function( e:any ){

          this.enableTools.importFiles = true;
  
        }.bind( this );

        myReader.readAsText( file );

      }else{
        
        unsupported = true;

      }

    }

    if( unsupported ){
      
      window.alert( "One of more files were not processed. Only .ply and .csv files are supported." );

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

    let job = {

      id: Math.random(),
      name: "2D Interpolation",
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

          // Store XYZI from interpolation
          this.openXYZI = this.jsonNaNValues( data );
          this.openXYZI = Object.values( this.openXYZI );
          
          // Create a plotly diagram, create image snapshot and destroy diagram
          this.createImagePreview();
          
          // Remove loading screen when we have loaded all of the models
          this.loadingFiles++;
          if( this.loadingFiles == this.filesLength ){

            this.enableTools.importFiles = true;
            this.loadingFiles = 0;

          }

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
                this.models[ dragId ] = [ this.openXYZ, this.openXYZI, url, this.precision, this.scale ];
                this.data.changeMessage( this.models );
                
                // Purge model and set selected file to empty
                Plotly.purge( "plotTarget" );

              }.bind( this )

            )

        }.bind( this )

      );

  }

  /**
   *  Drop image event for generating plot in specific area
   *  
   */
  generatePanel( event ){

    if( this.generatingContour ) return false;
    
    // Target area of dropped plot
    let target = "firstModel";
    this.targetArea = this.firstModel;
    if( this.findAncestor( event.target ,"#secondModel" ) ){
      target = "secondModel";
      this.targetArea = this.secondModel;
    }

    // Find dropped model
    let dragId = event.dataTransfer.getData("dragId");
    let droppedModel = this.models[ dragId ];
    
    if( !droppedModel ) return true;

    // Update XYZ, XYZI dimensions for dropped model
    if( target == "firstModel" ){

      this.firstCurrentXYZ = JSON.parse( JSON.stringify( droppedModel[0] ) );
      this.firstCurrentXYZI = JSON.parse( JSON.stringify( droppedModel[1] ) );
      this.firstLandmarks.length = 0;
      this.firstShapes.length = 0;
      this.firstAnnotations.length = 0;

    }else{

      this.secondCurrentXYZ = JSON.parse( JSON.stringify( droppedModel[0] ) );
      this.secondCurrentXYZI = JSON.parse( JSON.stringify( droppedModel[1] ) );
      this.secondLandmarks.length = 0;
      this.secondShapes.length = 0;
      this.secondAnnotations.length = 0;

    }

    // Draw plot
    this.drawPlot();

    let firstChild = this.firstModel.nativeElement.children[0];
    let secondChild = this.secondModel.nativeElement.children[0];

    // First of second model to attach events
    let child = firstChild;
    if( target == "secondModel" ){
      child = secondChild;
    }

    // Add event on created diagram
    let dragover = this.renderer.listen( child, "dragover", ( evt ) => { evt.preventDefault(); } );
    let drop = this.renderer.listen( child, "drop", ( evt ) => {
      
      // Remove listeners
      drop();
      dragover();

      this.generatePanel( evt );

    });

    // Contour plot has been generated
    if(
      this.firstCurrentXYZ &&
      this.secondCurrentXYZ
    ){
      
      this.enableTools.landmark = true;
      this.enableTools.delete = true;
      this.enableTools.measure = true;

    }

  }

  /**
   *  Draw Plot from dropped plot
   *  
   */
  drawPlot(){

    // Find if it is first or second model
    let targetId = this.targetArea.nativeElement.id;
    let currentXYZI;
    let model;
    
    if( targetId == "firstModel" ){

      currentXYZI = this.firstCurrentXYZI[2];
      model = "first";

    }else{

      currentXYZI = this.secondCurrentXYZI[2];
      model = "second";

    }

    // Purge target plot
    Plotly.purge( targetId );

    // Plot data
    let trace = {

      z: currentXYZI,
      type: 'heatmap',
      colorscale: this.colorScale,
      showscale: false
      
    };
    let data = [trace];

    // Create current plot
    Plotly.react(

      targetId,
      data,
      {
        title: "",
        xaxis: {
          title: ""
        },
        yaxis: {
          title: ""
        },
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

    );

    // PLOTLY EVENTS

    // Adding landmark event
    this.targetArea.nativeElement.on( 'plotly_click', function( eventData ){
          
      if( !this.flagLandmark ) return true;

      // Update landmarks table and restyle plot
      this.updateLandmarks( eventData, model );

    }.bind( this ) );

    // Quick Measure event
    this.targetArea.nativeElement.on( 'plotly_selected', function( eventData ){

      if( !this.flagMeasure ) return;

      this.quickMeasure( eventData );

    }.bind( this ) );

    // Move landmark event
    this.targetArea.nativeElement.on( 'plotly_relayout', function( eventData ){
      
      this.moveLandmark( model, eventData );

    }.bind( this ) );

  }

  /**
   *  Relayout event: Move landmark
   *  
   */
  moveLandmark( model, eventData ){
    
    if( !eventData ) return true;
    
    // We only care about a moving landmark
    let shapesExist = false;
    Object.keys( eventData ).forEach( function( key ) {

      if( key.search( "shapes" ) > -1 ) shapesExist = true;

    } );
    if( !shapesExist ) return false;

    // First or second model
    let landmarks = this.firstLandmarks;
    let shapes = this.firstShapes;
    let annotations = this.firstAnnotations;
    if( model == "second" ){
      landmarks = this.secondLandmarks;
      shapes = this.secondShapes;
      annotations = this.secondAnnotations;
    }

    for( let i = 0; i < landmarks.length; i++ ){

      // Get new X,Y dimensions
      let newX = Math.round( eventData["shapes[" + i + "].x0" ] * 100 ) / 100;
      let newY = Math.round( eventData["shapes[" + i + "].y0" ] * 100 ) / 100;

      if( newX && newY ){

        // Update landmarks, shapes and annotations arrays
        landmarks[i] = [ newX, newY ];
        shapes[i].x0 = newX;
        shapes[i].y0 = newY;
        shapes[i].x1 = newX + 5;
        shapes[i].y1 = newY + 5;
        annotations[i].x = newX;
        annotations[i].y = newY + 15;

        // Update shapes and annotations
        Plotly.relayout( model + "Model" , {

          shapes: shapes,
          annotations: annotations
    
        } );

        // Recreate contour plot if necessary
        this.createContourPlot();

        return true;
        
      }

    }

  }

  /**
   *  Show Statistics Save Pop Up
   *  
   */
  showStatistics(){

    // Checks before showing save popup
    if( !this.enableTools.export ) return true;
    if( !this.firstCurrentXYZI ) return true;
    if( !this.secondCurrentXYZI ) return true;
    if( !this.checkLandmarks() ) return true;
    if( this.generatingContour ) return true;

    this.savePopUpInfo = true;

  }
  
  /**
   *  Export Statistics
   *  
   */
  exportStatistics(){

    if( !this.saveFileName ) return true;

    this.savePopUpInfo = false;
    
    let models = [];
    models[0] = [ this.firstCurrentXYZI, this.firstA ];
    models[1] = [ this.secondCurrentXYZI, this.secondA ];

    let postData = {
      
      method: "statistics",
      models: JSON.stringify( models ),
      precision: this.precision,
      scale: this.scale

    };

    let job = {

      id: Math.random(),
      name: "Export Statistics",
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

          let jsonData =  this.jsonNaNValues( data );
          let names = ['mean', 'median', 'std', 'min', 'max', 'ptp', 'var_outlier_2sd','var_outlier_3sd'];

          for( let i = 0; i < names.length; i++ ){

            let name = names[i];
            let currentData = jsonData[i];
            let data = "X,Y,Z,\n";

            for( let i = 0; i < currentData.length; i++ ){
              let currentVertice = currentData[i];
              data += currentVertice[0] + "," + currentVertice[1] + "," + currentVertice[2] + ",\n";
            }

            // Download csv file  
            this.downloadFile( data, name );

          }

          // Create the mean/merge version of the two models in the models list
          this.openXYZ = jsonData[8];
          this.openXYZI = [ jsonData[9], jsonData[10], jsonData[11], jsonData[12], jsonData[13] ];
          this.createImagePreview();

          this.manageTools( true );

        }

      }.bind( this )
      
    );
    
  }

  /**
   *  Create download link and get file
   *  
   */
  downloadFile( data, name ){

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
    dwldLink.setAttribute( "download", this.saveFileName + "_" + name + ".csv" );
    dwldLink.style.visibility = "hidden";

    document.body.appendChild( dwldLink );
    dwldLink.click();
    document.body.removeChild( dwldLink );

  }

  /**
   *  Toggle landmark placing mode
   *  
   */
  toggleLandmarks(){

    if( !this.enableTools.landmark ) return true;
    if( this.generatingContour ) return true;
    if( !this.firstCurrentXYZI && !this.secondCurrentXYZI ) return true;

    this.flagLandmark = !this.flagLandmark;

    // Tools management
    if( !this.flagLandmark && !this.generatedContour ){

      this.manageTools( false );
      this.enableTools.importFiles = true;
      this.enableTools.landmark = true;
      this.enableTools.delete = true;
      this.enableTools.measure = true;

    }else if( this.flagLandmark ){

      this.manageTools( false );
      this.enableTools.landmark = true;
      this.enableTools.delete = true;

    }else{

      this.manageTools( true );

    }

    // Current models' data and layout
    let firstData = this.firstModel.nativeElement.data;
    let secondData = this.secondModel.nativeElement.data;
    let firstLayout = this.firstModel.nativeElement.layout;
    let secondLayout = this.secondModel.nativeElement.layout;

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

    // Set model diagrams to be editable in order to move landmarks or not
    Plotly.react(
      "firstModel",
      firstData,
      firstLayout,
      configOptions
    );

    Plotly.react(
      "secondModel",
      secondData,
      secondLayout,
      configOptions
    );

  }
  
  /**
   *  Add Landmakrs
   *  
   */
  updateLandmarks( eventData, model ){

    let landmarks = this.firstLandmarks;
    let shapes = this.firstShapes;
    let annotations = this.firstAnnotations;
    let id = "firstModel";

    if( model == "second" ){

      landmarks = this.secondLandmarks;
      shapes = this.secondShapes;
      annotations = this.secondAnnotations;
      id = "secondModel";

    }
    
    // The coordinates of mouse clicking on the diagram
    let x = eventData.points[0].x;
    let y = eventData.points[0].y;

    x = Math.round( x * 100 ) / 100;
    y = Math.round( y * 100 ) / 100;

    // Add landmark to table
    landmarks.push( [ x, y ] );
    let landmark = landmarks[ landmarks.length - 1 ];

    // Store and show landmarks as circle on diagram
    shapes.push(

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
    annotations.push(

      {
        x: landmark[0],
        y: landmark[1] + 15,
        text: "L" + landmarks.length,
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
    Plotly.relayout( id , {

      shapes: shapes,
      annotations: annotations

    } );

    this.createContourPlot();

  }

  /**
   *  Delete All Landmakrs
   *  
   */
  delLandmarks(){
    
    if( !this.enableTools.delete ) return true;
    if( this.generatingContour ) return true;
    if( !this.firstCurrentXYZI && !this.secondCurrentXYZI ) return true;
    
    // Remove landmarks 
    this.firstLandmarks.length = 0;
    this.firstShapes.length = 0;
    this.firstAnnotations.length = 0;
    this.secondLandmarks.length = 0;
    this.secondShapes.length = 0;
    this.secondAnnotations.length = 0;

    // Relayout first plot
    Plotly.relayout( "firstModel" , {

      shapes: this.firstShapes,
      annotations: this.firstAnnotations

    } );

    // Relayout second plot
    Plotly.relayout( "secondModel" , {

      shapes: this.secondShapes,
      annotations: this.secondAnnotations

    } );

  }

  /**
   *  Update contour plot from view
   *  
   */
  updateContourPlot(){

    // No contour generated yet
    if( this.secondA.length <= 0 ) return true;
    
    if( this.generatingContour ) return true;
    
    this.createContourPlot();

  }
  
  /**
   *  Create Contour plot in the middle 
   *  
   */
  createContourPlot(){

    if( !this.checkLandmarks() ) return false;
    if( this.generatingContour ) return false;

    this.generatingContour = true;

    // Call Server Side method
    let postData = {
      
      method: "contour",
      data: JSON.stringify( this.firstCurrentXYZI ),
      xyzi: JSON.stringify( this.secondCurrentXYZI ),
      landmarks1: JSON.stringify( this.firstLandmarks ),
      landmarks2: JSON.stringify( this.secondLandmarks ),
      transformation: this.transformation,
      line: this.line,
      triangle: this.triangle,
      circle: this.circle,
      contourLines: this.contourLines

    };

    let job = {

      id: Math.random(),
      name: "Generate Contour Plot",
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

          let jsonData =  this.jsonNaNValues( data );
          
          // Update error margin
          this.contourError = "Error: " + jsonData[0];

          // A element returned from server
          this.secondA = jsonData[6];

          // Contour levels from server
          let levelsFirst = jsonData[4];
          let levelsSecond = jsonData[5];
          let plotData = [];

          // Create contour lines for both models
          // Red for first and Blue for second
          for( let i = 0; i < 2; i++ ){

            let levels = levelsFirst;
            let z = this.firstCurrentXYZI[2];
            let colourScale = [ [0, 'rgb(255,0,0)'], [1, 'rgb(255,0,0)'] ];
            if( i == 1 ){
              levels = levelsSecond;
              z = jsonData[3];
              colourScale = [ [0, 'rgb(0,0,255)'], [1, 'rgb(0,0,255)'] ];
            }

            levels.forEach(element => {

              let trace = {
  
                z: z,
                type: 'contour',
                colorscale: colourScale,
                showscale: false,
                autocontour: false,
                contours:{
                  start: Math.round( element ),
                  end: Math.round( element ),
                  size:0,
                  coloring: 'lines'
                }
  
              };
  
              plotData.push( trace );
  
            });

          }

          // Draw Contour plot
          Plotly.react(

            "contourArea",
            plotData,
            {
              dragmode: "pan",
              hovermode: !1,
              title: "Red: First Model. Blue: Second Model."
            },
            {
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              doubleClick: false,
              modeBarButtons: [ [ "toImage", "resetScale2d", "zoom2d", "zoomIn2d", "zoomOut2d", "pan2d" ] ]
            }
    
          );

          this.generatingContour = false;
          this.generatedContour = true;

        }

      }.bind( this )

    );

  }

  /**
   *  Check Landmarks
   *  
   */
  checkLandmarks(){

    // Create/Update Contour plot only if we have >=3 landmarks,
    // on each plot and they are equal amount
    if( this.firstLandmarks.length < 3 ) return false;
    if( this.secondLandmarks.length < 3 ) return false;
    if( this.firstLandmarks.length != this.secondLandmarks.length ) return false;

    return true;
  }
 
  /**
   *  Toggle Quick Measure Tool
   *  
   */
  toggleQuickMeasure(){

    if( !this.enableTools.measure ) return true;
    if( this.generatingContour ) return true;
    if( !this.firstCurrentXYZI && !this.secondCurrentXYZI ) return true;
    
    this.flagMeasure = !this.flagMeasure;
    
    // Tools management
    if( !this.flagMeasure && !this.generatedContour ){

      this.manageTools( false );
      this.enableTools.importFiles = true;
      this.enableTools.landmark = true;
      this.enableTools.delete = true;
      this.enableTools.measure = true;

    }else if( this.flagMeasure ){

      this.manageTools( false );
      this.enableTools.measure = true;

    }else{

      this.manageTools( true );

    }

    // Set select mode bar on if we are going to do quick measure
    let dragmode = "pan";
    if( this.flagMeasure ){

      dragmode = "select";

    }

    Plotly.relayout( "firstModel" , {

      dragmode: dragmode

    } );

    Plotly.relayout( "secondModel" , {

      dragmode: dragmode

    } );

  }

  /**
   *  Quick Measure
   *  
   */
  quickMeasure( eventData ){

    if(  !eventData || !eventData.range ) return true;

    // Distance between two points
    let xBegin = Math.round( eventData.range.x[0] );
    let xEnd = Math.round( eventData.range.x[1] );
    let dx = xEnd - xBegin;

    // Actual distance
    this.quickDistance = Math.hypot( dx );
    this.quickDistance = Math.round( this.quickDistance * 100 ) / 100;

    this.quickScale = this.scales[ this.scale ].name;

    this.measurePopUpInfo = true;

  }

  /**
   *  Remove Contour Line
   * 
   */
  removeContourLine(){

    if( !this.enableTools.contourTools ) return true;
    if( this.generatingContour ) return true;
    if( !this.checkLandmarks() ) return true;

    let contourLines = Math.max( 0, this.contourLines - 1 );

    if( contourLines == this.contourLines ) return true;

    this.contourLines = contourLines;

    this.createContourPlot();

  }

  /**
   *  Add Contour Line
   * 
   */
  addContourLine(){

    if( !this.enableTools.contourTools ) return true;
    if( this.generatingContour ) return true;
    if( !this.checkLandmarks() ) return true;

    let contourLines = Math.min( 3, this.contourLines + 1 );

    if( this.contourLines == contourLines ) return true;

    this.contourLines = contourLines;
    
    this.createContourPlot();

  }
  
  /**
   * Change Colour Scale
   * 
   * Supported by plotly: Greys,YlGnBu,Greens,YlOrRd,Bluered,RdBu,Reds,Blues,Picnic,Rainbow,Portland,Jet,Hot,Blackbody,Earth,Electric,Viridis,Cividis
   */
  changeColourScale(){

    if( this.firstCurrentXYZI ){
      
      Plotly.restyle( "firstModel" ,{

        colorscale: this.colorScale

      });

    }

    if( this.secondCurrentXYZI ){

      Plotly.restyle( "secondModel" ,{

        colorscale: this.colorScale

      });

    }

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
   * Find ancestor that matches sel selector
   * 
   */
  findAncestor (el, sel) {

    if( el.id == sel.replace("#","") ) return el;
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
    return el;

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
   * Resize First Model Window
   * 
   */
  onResizeEnd( event: ResizeEvent ){

    let topWidth = this.topCompare.nativeElement.offsetWidth;
    let width = event.rectangle.width;
    let percentage =  100 * width / topWidth;
    
    // Limit from 20% to 50% width
    if( percentage > 50 ){

      percentage = 50;

    }else if( percentage < 20 ){

      percentage = 20;

    }
    
    // Apply style
    this.comparison.nativeElement.style.width = percentage + "%";

    // Apply style on other windows
    let otherWindows = (100 - percentage) / 2;
    this.firstModel.nativeElement.style.width = otherWindows + "%";
    this.secondModel.nativeElement.style.width = otherWindows + "%";
    
    // Re-adjust width for loaded models and contour plot
    if( this.firstCurrentXYZI ){

      Plotly.relayout( "firstModel", { width: this.firstModel.nativeElement.offsetWidth } );

    }

    if( this.secondCurrentXYZI ){

      Plotly.relayout( "secondModel", { width: this.secondModel.nativeElement.offsetWidth } );

    }

    if( this.contourError ){

      Plotly.relayout( "contourArea", { width: this.contourArea.nativeElement.offsetWidth - 2 } );

    }

  }

}
