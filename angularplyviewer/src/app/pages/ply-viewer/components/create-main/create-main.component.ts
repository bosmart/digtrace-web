import {Component, OnInit, Renderer2, RendererFactory2, ViewChild, Input, DoCheck} from '@angular/core';
import { JobService } from '../../services/job.service';
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";
import { MessageService } from '../../services/message.service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {UserService} from "../../services/user.service";
import {DjangoJobPlyService} from "../../services/django-job-ply.service";
import {DomSanitizer} from "@angular/platform-browser";
import { NgxSpinnerService } from "ngx-spinner";
import { NgxNotificationService } from 'ngx-notification';
import {st} from "@angular/core/src/render3";
// import { FlashMessagesService } from 'ngx-flash-messages';

import { environment } from '../../../../../environments/environment';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MatSnackBar } from '@angular/material';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

// Quick and dirty solution for compiling error
declare let require: any;

// Load threejs and PLY loader, Exporter
const THREE = require( 'three' );
const PLYLoader = require( 'three-ply-loader' );
const PLYExporter = require( 'ply-exporter' );
const webglEnabled = require('webgl-enabled')();

// Orbit Controls
const OrbitControls = require( 'three-orbit-controls' )(THREE);

@Component({
  selector: 'app-create-main',
  templateUrl: './create-main.component.html',
  styleUrls: ['./create-main.component.css'],
  host: {
    '(window:resize)': 'onDocumentResize($event)'
  }

})

export class CreateMainComponent implements OnInit, DoCheck {

  // View Queries on DOM
  @ViewChild('threedviewer') threedviewer;
  @ViewChild('uploadImageModel') uploadImageModel;


  // @Input()
  // message_which_id_file_to_load: string = 'test_message_param_pass_from_plyviewer';

  // File
  selectedFile: File;
  fileURL;
  plyFromURL = "";

  // WebGL Renderer tools
  webgl;
  scene = new THREE.Scene();
  canvas;
  camera;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  webglSupport = new webglEnabled();

  // Flags
  addPoints = false;
  cropTools = false;
  distancePoints = false;
  fullscreen = false;

  // Tools
  points = [];
  distance = 300;
  modelMesh;
  boundingBox;
  saveFileName;
  xAxis = false;
  yAxis = false;
  zAxis = false;
  measureDistance = 0;
  scale = 1;
  excludeAttributes = [];

  // Clipping planes for cropping
  topPlane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 2 );
  leftPlane = new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), 2 );
  rightPlane = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 2 );
  bottomPlane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 2 );
  zPlane = new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), 2 );

  // Helpers for cropping
  helpers = new THREE.Group();

  // 3D cropping range
  maxLeftCrop = 1;
  minLeftCrop = 0;
  leftCropValue = 1;
  maxRightCrop = 1;
  minRightCrop = 0;
  rightCropValue = 1;
  maxTopCrop = 1;
  minTopCrop = 0;
  topCropValue = 1;
  maxBottomCrop = 1;
  minBottomCrop = 0;
  bottomCropValue = 1;
  maxZCrop = 1;
  minZCrop = 0;
  zCropValue = 1;

  // server side jobs
  jobs;  
  //job data input from sidebar load icon      
  
  // Vertices
  vertices;
  verticesXYZ = [];

  // Save File Types
  fileTypes = [
    { name: "PLY" },
    { name: "CSV" }
  ];

  saveFileType = "PLY";
  plyExporter;
  loader;

  // Popup info and loading screen
  savePopUpInfo = false;
  invertPopUpInfo = false;
  scalePopUpInfo = false;
  cropToolsInfo = false;
  measurePopUpInfo = false;

  enableTools = {
    uploadFile : true,
    scale: false,
    autorotate: false,
    invert: false,
    threedcrop: false,
    measure: false,
    snapshot: false,
    fullscreen: false,
    flat: false,
    save: false
  };
  // private message: any;
  old_message: any = {};
  subscription: Subscription;
  private init:any;
  private message: any = {}
  private ply_from_django: any;
  private load_from_blob: boolean=false;
  private animated_text: any;
  private text_mesh: any;
  private renderer2: Renderer2;

  constructor(private ngxSpinnerService: NgxSpinnerService,
              private ngxNotificationService: NgxNotificationService,
              private sanitizer: DomSanitizer,
              private _djangoJobPlyService: DjangoJobPlyService,
              private rendererFactory2: RendererFactory2,
              private jobService: JobService,
              private messageService: MessageService,
              private http: HttpClient,
              private _userService: UserService,
              private dataSharingService: DataSharingService,
              private dataService: DataService,
              private snackBar: MatSnackBar){
    // this.subscription = this.messageService.getMessage().subscribe(message => { this.message = message; });
    this.renderer2 = rendererFactory2.createRenderer(null,null)
    this.init = -1
  }

  ngOnInit(){
    // this.message = ''
    // Get all jobs
    // this.messageService.getMessage().subscribe(message => { this.old_message = message; });
    this.old_message = this.messageService.getMessage();    
    this.getJobs();

    this.dataSharingService.getData().subscribe(res=>{  
      if(this.init==-1){        
        this.init = -2
      }  
      else{     
        if(res=='toggleCanvasSize'){          
          this.canvas.style.width = '100%'          
        }
        else if(res.jobId){          
          this.getPlyFromDjango(res.jobId)
        }
        else if(res.jobData){          
          this.scene.remove(this.modelMesh);
          this.showText(res.jobData.status, res.jobData.id, res.jobData.name)
        }        
      }                                                      
  })                

    // this.data.getMessageToLoadDjangoPlyFile.subscribe(currentMessageForDjango => this.message_for_django = currentMessageForDjango)
    //

    //   this.subscription = this.messageService.getMessageToLoadDjangoPlyFile()
    // .subscribe(currentMessageForDjango => this.message_for_django = currentMessageForDjango)

    // console.log('test from create main')
    //
    // console.log(this.message)
    // console.log('test from create main')


  }

  ngDoCheck() {
    // this.data.currentMessageForDjango.subscribe(currentMessageForDjango => this.message_for_django = currentMessageForDjango)
    //
    // // check for object mutation
    //       console.log(this.message)
    // this.messageService.getMessage().subscribe(message => { this.message = message; });
    this.message = this.messageService.getMessage();

    if (this.message != this.old_message) {
      console.log('new msg');
      console.log(this.message);
      console.log('old msg');
      console.log(this.old_message);
      console.log('getting ply')

      if (this.message.toString() != 'refresh') {

        if (this.message.toString().split('_').length == 1) {
          this.getPlyFromDjango(this.message);
          console.log('len 1')
          console.log(this.message.toString())
        } else {
          this.scene.remove(this.modelMesh);
          let id = this.message.toString().split('_')[0];
          let status = this.message.toString().split('_')[2];
          let name = this.message.toString().split('_')[4];

          this.showText(status, id, name)
          // setTimeout(() =>   this.showText(status,id,name), 5000);
          console.log('show_text_called');
        }
        this.old_message = this.message;
      }
    }
  }

  showText(status, id, name){
    let pop_up_msg = '';
    let theme ='';
    if (status=='100'){
      if (name.length > 8){
              pop_up_msg = 'This job '.concat(name.substring(0,7)).concat('.. has not been submitted!, click submit button to submit this job to get a ply/model');
      }
      else{
              pop_up_msg = 'This job '.concat(name).concat(' has not been submitted!, click submit button to submit this job to get a ply/model');

      }
      theme = 'info'
    }
    else if(status>Number('100') && status<Number('204') ){
            if (name.length > 8){
            pop_up_msg = 'This job '.concat(name.substring(0,7)).concat('.. doesn\'t have a Model/PLY yet! and is currently being processed')
      }
      else{
            pop_up_msg = 'This job '.concat(name).concat(' doesn\'t have a PLY/model yet! and is currently being processed')
      }
      theme = 'info'
    }
    else if(status>Number('221') && status<Number('224') ){
      if (name.length > 8){
          pop_up_msg = 'This job '.concat(name.substring(0,7)).concat('.. is currently recieving a PLY/Model file, please try later');
      }
      else{
          pop_up_msg = 'This job '.concat(name).concat(' is currently recieving a PLY/Model file, please try later');
      }
      theme = 'success'
    }
    else{
      if (name.length > 8){
          pop_up_msg = 'This job '.concat(name.substring(0,7)).concat('.. failed, double check images!!\\ for admin support: quote code: '.concat(status).concat(' and job id: ').concat(id));
      }
      else{
          pop_up_msg = 'This job '.concat(name).concat(' failed, double check images!!\\ for admin support: quote code: '.concat(status).concat(' and job id: ').concat(id));
      }
      theme = 'danger'
    }

    this.snackBar.open(pop_up_msg,'',{
      duration:5000,
      horizontalPosition:'center',             
      panelClass:[`alert-${theme}`, 'snackbar-ply']         
    })

            this.ngxNotificationService.sendMessage( pop_up_msg, theme, 'center')
      //
      //    this.flashMessagesService.show(pop_up_msg, {
      // classes: [theme], // You can pass as many classes as you need
      // timeout: 1000, // Default is 3000
      //       });

    //
    // for (let i=0; i<1; i++) {
    //   task(i,  this.ngxNotificationService);
    // }
    //
    // function task(i, ngxNotificationService) {
    //   setTimeout(function() {
    //     // Add tasks to do
    //     ngxNotificationService.sendMessage( pop_up_msg, theme, 'center')
    //   }, 2000 * i);
    // }
//
//     for (var _i = 0; _i < 1000; _i++) {
//
//       this.ngxNotificationService.sendMessage( pop_up_msg, theme, 'center');
//
//       setTimeout(() =>      this.ngxNotificationService.sendMessage( pop_up_msg, theme, 'center')
// , 5000);
//
//       this.ngxNotificationService.sendMessage( pop_up_msg, theme, 'center');
//
//
//     }
  }


  ngAfterViewInit(){
    // console.log(this.message)
    // WebGL support Check
    if( !this.webglSupport.isWebGLAvailable() ){
      window.alert( this.webglSupport.getWebGLErrorMessage().innerHTML );
      return true;
    }
    // Initialise ThreeJS renderer and canvas
    this.webgl = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    this.canvas = this.webgl.domElement;
    // Append canvas
    this.threedviewer.nativeElement.appendChild( this.canvas );
    // Canvas styling
    this.canvas.id = "mainCanvas";
    this.canvas.style.position = "static";
    this.canvas.style.height = '100%';
    this.canvas.style.width = this.canvas.parentElement.offsetWidth + "px";
    // Set the background color of the scene.
    this.webgl.setClearColor( 0x4E4E4E, 1 );
    // Set up clipping planes
    this.webgl.localClippingEnabled = true;
    this.webgl.clippingPlanes = [ this.topPlane, this.bottomPlane, this.leftPlane, this.rightPlane, this.zPlane ];
    // Add helpers for clipping
    this.helpers.add( new THREE.PlaneHelper( this.topPlane, 2, 0xff0000 ) );
    this.helpers.add( new THREE.PlaneHelper( this.leftPlane, 2, 0x00ff00 ) );
    this.helpers.add( new THREE.PlaneHelper( this.rightPlane, 2, 0x0000ff ) );
    this.helpers.add( new THREE.PlaneHelper( this.bottomPlane, 2, 0xff0000 ) );
    this.helpers.add( new THREE.PlaneHelper( this.zPlane, 2, 0x00ff00 ) );
    this.helpers.visible = false;
    this.scene.add( this.helpers );
    // Add a light to the scene
    let light = new THREE.PointLight( 0xffffff );
    light.position.set( 0, 0, -1 );
    this.scene.add( light );
    // Create a camera, zoom it out from the model a bit, and add it to scene
    this.camera = new THREE.PerspectiveCamera( 60, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000 );
    this.camera.position.set( 0, 0, -1 );
    this.camera.lookAt( this.scene.position );
    this.scene.add( this.camera );

    // Rendering the actual model
    let animate = function(){

      requestAnimationFrame( animate );
      this.webgl.render( this.scene, this.camera );

    }.bind( this );
    animate();

    // Events attached using Render2 on the first load
    this.attachCanvasEvents();

    if(!this.text_mesh){
      // PLY Importing and exporting
      PLYLoader( THREE );
      PLYExporter( THREE );

      this.loader = new THREE.PLYLoader();

      // Assigned different colour property naming
      this.loader.setPropertyNameMapping( {

        ambient_red: 'red',
        ambient_green: 'green',
        ambient_blue: 'blue',
        diffuse_red: 'red',
        diffuse_green: 'green',
        diffuse_blue: 'blue',
        specular_red: 'red',
        specular_green: 'green',
        specular_blue: 'blue'

      } );

      let href = window.location.href;

      // If we are loading a ply from the URL string
      if( href.search( "\\.ply" ) > -1 ){

        let location = href.split("/");
        let plyFile = location[ location.length - 1 ];
        this.plyFromURL =  'http://127.0.0.1:4200/researchImpact/mediafiles/JobFiles/' + plyFile;

        //call authorization api on server(django)
        //if(authorized){}
        this.loadModel();
        //}
        //else {redirect to login page}
      }
    }

  }

  /*
   * Get all jobs
   *
   */

  //
  getPlyFromDjango(id){
    this.ngxSpinnerService.show()

    this._djangoJobPlyService.getPlyFromDjango(id).subscribe(        
        data => {
          this.ply_from_django = URL.createObjectURL(data);
          console.log(this.ply_from_django.toString());
          this.load_from_blob = true;

          // convert the dates to a nice format

        },
        // the second argument is a function which runs on error
        err => {console.error(err);  this.ngxSpinnerService.hide();

          this.ngxNotificationService.sendMessage('Something went wrong, please make sure the ply from this job is not deleted!', 'warning', 'center');
          this.load_from_blob = false;},
        // the third argument is a function which runs on completion

        () => {console.log('recieved ply file from django');
          this.ngxSpinnerService.hide();       
          this.loadModel();
          this.load_from_blob = false;}
    );
    //     this.ply_from_django = this._djangoJobPlyService.getPlyFromDjango(this.message);
    //     console.log('tostring')
    //     console.log(this.ply_from_django.toString())



  }

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
   * Enable or Disable All Tools
   *
   */
  manageTools( state ){

    Object.keys( this.enableTools ).forEach( key => {

      this.enableTools[key] = state;

    } );

  }

  /*
   * Open file dialog
   *
   */
  openFileDialog(){

    if( !this.enableTools.uploadFile ) return true;

    this.uploadImageModel.nativeElement.click();

  }

  /*
    * Uploading file
    *
    * 
  */
  onFileChanged( event ){

    if( !this.enableTools.uploadFile ) return true;

    this.selectedFile = event.target.files[0]
    event.target.value = "";
    this.onUpload();

  }

  /*
    * Upload event
    *
    * 
  */
  onUpload(){

    let nameSplit = this.selectedFile.name.split( "." );
    let ext = nameSplit[ nameSplit.length - 1 ].toLowerCase();

    if( ext == "ply" ){

      this.loadModel();

    }else{

      window.alert( "Only files with .ply extension are supported." );

    }

  }

  /*
    * Load model. 
    * Attach toolbar events after model is loaded.
    * 
    * NOTE: Model needs to have VERTICES AND FACES 
    *       in order to load correctly.
    * 
  */
  loadModel(){

    // Remove any previous model before loading
    this.scene.remove( this.modelMesh );    
    // Adjust canvas width according to its parent
    this.canvas.style.width = this.canvas.parentElement.offsetWidth + "px";

    this.manageTools( false );

    // Reading PLY file notification
    this.jobService.notifyWithLoader( "Reading PLY file", 5000 );

    if( this.plyFromURL ){

      this.fileURL = this.plyFromURL;

    }else if( this.selectedFile ){

      this.fileURL = window.URL.createObjectURL( this.selectedFile );

    } else if(this.load_from_blob){

      // let blob = new Blob([this.ply_from_django.data]);

      this.fileURL = this.ply_from_django;


    }


    else{

      window.alert( "Could not read selected file." );
      return true;

    }

    this.loader.load(

        this.fileURL,

        // Successful Loading
        function( geometry ){

          // Centre mesh
          geometry.computeVertexNormals();
          geometry.center();

          // Material
          let material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, vertexColors: THREE.VertexColors, clippingPlanes: [ this.topPlane, this.bottomPlane, this.leftPlane, this.rightPlane, this.zPlane ] } );

          this.excludeAttributes.length = 0;

          // If there is no colour from the original ply file then add random colours
          if( geometry.attributes && !geometry.attributes.color ){

            var positionAttribute = geometry.attributes.position;

            var colors = [];
            var color = new THREE.Color();

            for ( var i = 0, il = positionAttribute.count; i < il; i ++ ) {

              color.setHSL( i / il * Math.random(), 0.5, 0.5 );
              colors.push( color.r, color.g, color.b );

            }

            // New Colours
            geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

            // Using Standard Material that gets affected by light instead of Basic
            material = new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, vertexColors: THREE.VertexColors, clippingPlanes: [ this.topPlane, this.bottomPlane, this.leftPlane, this.rightPlane, this.zPlane ] } );

            // Exclude color when exporting model as ply
            this.excludeAttributes.push("color");

          }

          this.modelMesh = new THREE.Mesh( geometry, material );

          this.modelMesh.castShadow = false;
          this.modelMesh.receiveShadow = false;

          this.scene.add( this.modelMesh );

          // Set up cropping range according to the bounding box
          this.setCroppingRange();

          // Enable All Tools
          this.manageTools( true );

          // Store vertices
          this.vertices = this.modelMesh.geometry.getAttribute( "position" ).array;

          this.verticesXYZ.length = 0;

          for( let i = 0; i < this.vertices.length; i = i+3 ){

            this.verticesXYZ.push( [ this.vertices[i], this.vertices[i + 1], this.vertices[i + 2] ] );

          }

          // Focus on canvas
          this.focusCanvas();

          // Revoke temporary URL
          if( this.selectedFile ) window.URL.revokeObjectURL( this.selectedFile );
          this.plyFromURL = "";

        }.bind( this ),

        false,

        false,

        // Unsuccessful Loading
        function(){

          this.manageTools( true );
          this.plyFromURL = "";

        }.bind( this )

    );

    // Controls for orbiting around the model
    let controls = new OrbitControls( this.camera, this.canvas );
    controls.zoomSpeed  = 3.0;
    controls.update();

    // Resize Renderer and Pixel ratio
    this.webgl.setPixelRatio( window.devicePixelRatio );
    this.webgl.setSize( this.canvas.clientWidth, this.canvas.clientHeight );

  }

  /*
  * Events attached with Render2
  *
  */
  attachCanvasEvents(){

    // Method to handle clicking on the model
    this.renderer2.listen( this.canvas, 'mouseup', ( evt )=>{

      evt.preventDefault();
      this.focusCanvas();

      // No model loaded
      if( !this.modelMesh ) return false;

      // Click position
      this.mouse.x =  ( ( evt.clientX - this.canvas.getBoundingClientRect().left ) / this.canvas.clientWidth ) * 2 - 1;
      this.mouse.y =  - ( ( evt.clientY - this.canvas.getBoundingClientRect().top ) / this.canvas.clientHeight ) * 2 + 1;

      // Check if the mouse click is intersecting with the model
      this.raycaster.setFromCamera( this.mouse, this.camera );
      let interesects = this.raycaster.intersectObject( this.modelMesh );

      if( interesects.length ){

        if( this.addPoints || this.distancePoints ){

          if( this.points.length <= 1 ){

            // Add a point on the model
            let spriteMaterial = new THREE.SpriteMaterial( { color: 0xFF0000 } );
            let sprite = new THREE.Sprite( spriteMaterial );
            sprite.scale.set(.03, .03, 1);
            sprite.position.copy( interesects[0].point );

            this.modelMesh.add( sprite );
            this.points.push( sprite );

            if( this.points.length == 2 ){

              if( this.addPoints ){

                this.scalePopUpInfo = true;

              }else{

                this.measureDistance = this.points[0].position.distanceTo( this.points[1].position );
                this.measureDistance = Math.round( this.measureDistance * 100 );
                this.clearPoints();
                this.measurePopUpInfo = true;
                this.enableMeasure();

              }

            }

          }

        }

      }

    });

    // Full screen event key attachment
    this.renderer2.listen( this.canvas, 'keyup', ( event )=>{

      let keyCode = event.keyCode ? event.keyCode : event.which;

      // Key F/f
      if( keyCode != 70 ) return true;

      if( keyCode ){

        this.toggleFullScreen();

      }

    });

  }

  /*
  * Focus on the canvas for key up events
  *
  */
  focusCanvas(){

    this.canvas.setAttribute( "tabindex" , 0 );
    this.canvas.focus();

  }

  /*
  * Toggle full screen of 3D model
  *
  */
  toggleFullScreen(){

    if( !this.fullscreen ){

      if( this.canvas.mozRequestFullScreen ){

        this.canvas.mozRequestFullScreen();

      }else if( this.canvas.webkitRequestFullscreen ){

        this.canvas.webkitRequestFullscreen();

      }else if( this.canvas.msRequestFullscreen ){

        this.canvas.msRequestFullscreen();

      }else if( this.canvas.requestFullscreen ){

        this.canvas.requestFullscreen();

      }

      this.fullscreen = true;

    }else{

      if( document['mozCancelFullScreen'] ){

        document['mozCancelFullScreen']();

      }else if( document['webkitExitFullscreen'] ){

        document['webkitExitFullscreen']();

      }else if( document['msExitFullscreen'] ){

        document['msExitFullscreen']();

      }else if( document.exitFullscreen ){

        document.exitFullscreen();

      }

      this.fullscreen = false;

    }

    this.focusCanvas();

  }

  /*
  * Toggle helpers for cropping
  *
  */
  toggleHelpers( event ){

    let checked = event.target.checked;

    this.helpers.visible = checked;

  }

  /*
  * Document/Window resizing.
  *
  */
  onDocumentResize(){    
    if( !this.canvas || !this.canvas.parentElement ) return true;
    this.canvas.style.width = this.canvas.parentElement.offsetWidth + "px";
    this.canvas.style.height = '100%';
    this.webgl.setSize( this.canvas.clientWidth, this.canvas.clientHeight );
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  /*
   *  Clear points added on the model
   *
   */
  clearPoints(){

    for( let i=0; i < this.points.length; i++ ){

      this.modelMesh.remove( this.points[i] );

    }

    this.points.length = 0;

  }

  /*
   * Toggle 3D Model Scaling
   *
   */
  toggleScale(){

    if( !this.enableTools.scale ) return true;

    this.addPoints = !this.addPoints;

    if( this.addPoints ){

      this.manageTools( false );
      this.enableTools.scale = true;

    }else{

      this.clearPoints();
      this.manageTools( true );

    }

  }

  /*
  * Validate scale distance input
  *
  */
  validateDistance(event:any){

    // Enter key
    if( event.keyCode == 13 ){

      this.doScale();
      return true;

    }

    // Validation
    if( isNaN( event.target.value ) ){

      this.distance = 10;

    }

    this.distance = event.target.value;

  }

  /*
  * Do the actual scale
  *
  * NOTE: While THREEjs unitless, we assume 1 unit to be 1 meter
  */
  doScale(){

    if( !this.distance ) return true;

    // Distance set by the user and distance between the two points sets the actual scale
    let pointDistance =  this.points[1].position.distanceTo( this.points[0].position ) * 100;
    this.scale = this.distance / pointDistance;

    // Scale model
    this.modelMesh.geometry.scale( this.scale, this.scale, this.scale );

    // Adjust camera
    this.camera.position.set ( 0, 0, -1 * this.scale );

    // Adjust Cropping Planes
    this.setCroppingRange();

    this.scalePopUpInfo = false;

    // Do not continue adding more points
    this.toggleScale();

  }

  /*
  * Clear Scale PopUp info
  *
  * Clears up points also
  */
  closeScalePopUp(){

    this.clearPoints();
    this.scalePopUpInfo = false;

  }

  /*
   * Toggle 3D Cropping/Clipping
   *
   */
  toggleCrop3D(){

    if( !this.enableTools.threedcrop ) return true;

    this.cropTools = !this.cropTools;

    if( this.cropTools ){

      this.cropToolsInfo = true;
      this.manageTools( false );
      this.enableTools.threedcrop = true;

    }else{

      this.cropToolsInfo = false;
      this.manageTools( true );

    }

  }

  /*
   * Calculate min and max for each cropping plane
   *
   */
  setCroppingRange(){

    // Get Bounding box for loaded model
    this.boundingBox = this.modelMesh.geometry.boundingBox;

    let rangeX = this.boundingBox.max.x - this.boundingBox.min.x;
    let rangeY = this.boundingBox.max.y - this.boundingBox.min.y;
    let rangeZ = this.boundingBox.max.z - this.boundingBox.min.z;

    this.leftPlane.constant = this.leftCropValue = this.maxLeftCrop = rangeX;
    this.minLeftCrop = -rangeX;

    this.rightPlane.constant = this.rightCropValue = this.maxRightCrop = rangeX;
    this.minRightCrop = -rangeX;

    this.topPlane.constant = this.topCropValue = this.maxTopCrop = rangeY;
    this.minTopCrop = -rangeY;

    this.bottomPlane.constant = this.bottomCropValue = this.maxBottomCrop = rangeY;
    this.minBottomCrop = -rangeY;

    this.zPlane.constant = this.zCropValue = this.maxZCrop = rangeZ;
    this.minZCrop = -rangeZ;

  }

  /*
   *  Reset Cropping Values on Tool
   *
   */
  resetCroppingToolValues(){

    this.leftPlane.constant = this.leftCropValue = this.maxLeftCrop;
    this.rightPlane.constant = this.rightCropValue = this.maxRightCrop;
    this.topPlane.constant = this.topCropValue = this.maxTopCrop;
    this.bottomPlane.constant = this.bottomCropValue = this.maxBottomCrop;
    this.zPlane.constant = this.zCropValue = this.maxZCrop;

  }

  /*
  * Do the actual cropping
  *
  */
  doCrop( evt ){

    let inputValue = evt.target.value;

    if( evt.target.id =="topCrop" ){

      this.topPlane.constant = inputValue;
      this.topCropValue = inputValue;

    }else if( evt.target.id =="leftCrop" ){

      this.leftPlane.constant = inputValue;
      this.leftCropValue = inputValue;

    }else if( evt.target.id =="rightCrop" ){

      this.rightPlane.constant = inputValue;
      this.rightCropValue = inputValue;

    }else if( evt.target.id =="bottomCrop" ){

      this.bottomPlane.constant = inputValue;
      this.bottomCropValue = inputValue;

    }else if( evt.target.id =="zCrop" ){

      this.zPlane.constant = inputValue;
      this.zCropValue = inputValue;

    }

  }

  /*
  * Do Auto-Rotate
  *
  */
  doAutoRotate(){

    if( !this.enableTools.autorotate ) return true;
    if( !this.verticesXYZ.length ) return true;

    let postData = {

      method: "autoRotateCreatePanel",
      data: this.verticesXYZ

    };

    // Call server side function with a job
    let job = {

      id: Math.random(),
      name: "Auto Rotate 3D Model",
      status: 1,
      postData: postData,
      request: {},
      caller: this

    };

    this.manageTools( false );
    this.enableTools.fullscreen = true;

    // Call autorotate method through job service
    this.jobService.addJob(

        job,

        function( data ){

          if( !data ) return false;

          if( typeof data == "string" ){

            // Update job's status
            job.status = 2;
            this.updateJob( job );

            let jsonData = JSON.parse( data.replace( /NaN/gi, "\"nan\"" ) );
            let newXYZ = jsonData[0];

            // Apply new XYs on the mesh
            this.verticesXYZ = newXYZ;
            for( let i = 0; i < newXYZ.length; i++ ){
              this.vertices[i*3] = newXYZ[i][0];
              this.vertices[i*3 + 1] = newXYZ[i][1];
              this.vertices[i*3 + 2] = newXYZ[i][2];
            }

            // Update geometry
            this.modelMesh.geometry.dispose();
            this.modelMesh.geometry.getAttribute( "position" ).needsUpdate  = true;

            // Enable tools
            this.manageTools( true );

          }

        }.bind( this )

    );

  }

  /*
  * Show Invert Pop Up info
  *
  */
  showInvertPopUpInfo(){

    if( !this.enableTools.invert ) return true;
    if( !this.vertices ) return true;

    this.invertPopUpInfo = true;

  }

  /*
  * Invert Model
  *
  */
  doInvert(){

    if( !this.enableTools.invert ) return true;

    // Original data and axes to invert to
    let xAxis = this.xAxis ? 1 : 0;
    let yAxis = this.yAxis ? 1 : 0;
    let zAxis = this.zAxis ? 1 : 0;

    // If no axes is selected do not invert
    if( xAxis == 0 && yAxis == 0 && zAxis == 0 ) return true;

    // Disable other tools
    this.manageTools( false );
    this.enableTools.invert = true;

    // Invert axes
    for( let i = 0; i < this.verticesXYZ.length; i++ ){

      if( this.xAxis ){
        this.vertices[i*3] *= -1;
        this.verticesXYZ[i][0]  *=  -1;
      }

      if( this.yAxis ){
        this.vertices[i*3+1] *= -1;
        this.verticesXYZ[i][1]  *= -1;
      }

      if( this.zAxis ){
        this.vertices[i*3+2] *= -1;
        this.verticesXYZ[i][2]  *= -1;
      }

    }

    // Update geometry
    this.modelMesh.geometry.dispose();
    this.modelMesh.geometry.getAttribute( "position" ).needsUpdate  = true;

    // Enable tools
    this.manageTools( true );

    // Close loading and popup infos
    this.invertPopUpInfo = false;

  }

  /*
  * Measure Distances
  *
  */
  enableMeasure(){

    if( !this.enableTools.measure ) return true;

    this.distancePoints = !this.distancePoints;

    if( this.distancePoints ){

      this.manageTools( false );
      this.enableTools.measure = true;

    }else{

      this.clearPoints();
      this.manageTools( true );

    }

  }

  /*
  * Take screenshot of current 
  *
  */
  saveScreenshot(){

    if( !this.enableTools.snapshot ) return true;

    // Create link of current view and download file
    let imgData = this.webgl.domElement.toDataURL( "image/jpeg" );
    let strData = imgData.replace( "image/jpeg", "image/octet-stream" );
    let link = document.createElement('a');
    document.body.appendChild(link);
    link.download = "DigtracePro_Screenshot.jpg";
    link.href = strData;
    link.click();
    document.body.removeChild(link);

  }

  /*
  * Show Model from the top 
  *
  */
  showModelFlat(){

    if( !this.enableTools.flat ) return true;

    this.camera.position.set( 0, 0, -1 * this.scale );
    this.camera.lookAt( this.scene.position );
    this.camera.updateProjectionMatrix();

  }

  showSavePopUpInfo(){

    if( !this.enableTools.save ) return true;
    if( !this.vertices ) return true;

    this.savePopUpInfo = true;

  }

  /*
  * Save As CSV/PLY File
  *
  */
  doSaveAs(){

    if( !this.saveFileName ) return true;

    let option = "csv";
    if( this.saveFileType == "PLY" ){
      option = "ply";
    }

    this.downloadFile( option );

  }

  /**
   * Creating and Downloading CSV/PLY file
   *
   */
  downloadFile( option ){

    let blob;
    let data;

    if( option == "csv" ){

      data = "X,Y,Z,\n";

      for( let i = 0; i < this.vertices.length; i=i+3 ){
        data += this.vertices[i] + "," + this.vertices[i + 1] + "," + this.vertices[i + 2] + ",\n";
      }

      // Create csv Blob data
      blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });

    }else if( option == "ply" ){

      if( !this.plyExporter ) this.plyExporter = new THREE.PLYExporter();

      // Create PLY Blob data
      data = this.plyExporter.parse( this.modelMesh, function(){}, { excludeAttributes: this.excludeAttributes } );

      blob = new Blob( [ data ], { type: 'text/plain' } );

    }

    let dwldLink = document.createElement( "a" );
    let url = URL.createObjectURL( blob );

    //if Safari open in new window to save file with random filename.
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf( 'Chrome' ) == -1;

    if( isSafariBrowser ) {

      dwldLink.setAttribute("target", "_blank");

    }

    dwldLink.setAttribute( "href", url) ;
    dwldLink.setAttribute( "download", this.saveFileName + "." + option );
    dwldLink.style.visibility = "hidden";

    document.body.appendChild( dwldLink );
    dwldLink.click();
    document.body.removeChild( dwldLink );

    this.savePopUpInfo = false;

  }

}
