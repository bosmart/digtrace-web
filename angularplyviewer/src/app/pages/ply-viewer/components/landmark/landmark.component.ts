import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-landmark',
  templateUrl: './landmark.component.html',
  styleUrls: ['./landmark.component.css']
})

export class LandmarkComponent implements OnInit {

  // View Queries on DOM
  @ViewChild('preview') preview;

  uploadCSVFile;

  // Save file
  saveFileName;
  fileList;
  savePopUpInfo = false;

  // Image list, each list item is modeled like [ image element, landmarks ]
  images = [];

  // Width and Height and X,Y of the original image
  originalImageWidth;
  originalImageHeight;

  // Ratios between current ZOOMED in/out and ORIGINAL image width/height
  widthRatio = 1;
  heightRatio = 1;

  // Image's top left corner when NOT centered
  deltaX = 0;
  deltaY = 0 ;

  // Image's top left corner when centered
  centeredDeltaX;
  centeredDeltaY;
  
  // Mouse click x and y on the image with deltaX,deltaY as origin
  imageClickX = 0;
  imageClickY = 0;

  // Click x and y on the actual canvas
  clickX;
  clickY;

  // Current image
  img;

  // canvas and 2d context
  canvas;
  ctx;

  // Current Image width/height
  currentImageWidth = 500;
  currentImageHeight = 500;

  // Various Flags and point/image indexes
  mirror = false;
  dragging = false;
  addPoints =  false;
  delFromCanvas = -1;
  movingPoint = -1;
  selectedImage = -1;
  flip = false;
  togglePoints = false;

  Math = Math;

  // Current image's landmarks.
  // Using the image's top left corner and natural dimensions
  // [ landmark's X, landmark's Y, current Image Width ]
  points = [];

  constructor() { }

  ngOnInit(){}

  ngAfterViewInit(){

    this.canvas = this.preview.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    
  }

  /**
   *  File input changed
   *  
   */
  onFileChanged( event ){

    // Update canvas width,height if not set up
    if( this.canvas.width != this.canvas.clientWidth || 
        this.canvas.height != this.canvas.clientHeight ){

      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

    }

    this.fileList = event.target.files;
    this.onUpload( event );

  }

  /**
   *  Upload Event
   *  
   */
  onUpload( event ){
    
    let targetId = event.target.id;

    if( targetId == "importLandmark" ){
      
      // Upload Image
      this.uploadImages();

    }else{

      // Upload CSV
      this.uploadCSV();

    }
    
  }

  /**
   *  Upload Images
   *  
   */
  uploadImages(){

    for( let i = 0; i < this.fileList.length; i++ ){

      let reader = new FileReader();
      let img = new Image();

      // Image load event
      let imgEvent = function(){
        
        img.setAttribute( "title", this.fileList[i].name );
        this.images.push( [ img, this.points ] );

      };
      
      // Reader event
      let readerEvent = function(){
        
        img.setAttribute( "src", reader.result as string );

      };

      // Attach load events
      img.addEventListener( "load", imgEvent.bind( this ), false );
      reader.addEventListener( "load", readerEvent.bind( this ), false );

      // Read file
      reader.readAsDataURL( this.fileList[i] );

    }

  }

  /**
   *  Upload CSV
   * 
   * Buildup the image list from the csv.
   * 
   * Images should be uploaded at a server location
   *   
   */
  uploadCSV(){

    let csvFile = this.fileList[0];
    let reader = new FileReader();

    let readerEvent = function(){

      let csvData = reader.result as string;
      let csvArray = csvData.split("\n");

      let images = [];
      let imageName = "";
      
      // Go through each CSV line
      csvArray.map( ( line, index ) => {

        // This should be replaced with a server location
        let imagePath = "./assets/upload/images/";

        // Ignore the first line
        if( index > 0 ){

            // Column values for each line
            let elements = line.split(",");

            // Group each result with image object
            if( elements[0] ){

              if( elements[0] != imageName ){
                
                let img = new Image();
                img.setAttribute( "title", elements[0] );
                img.setAttribute( "src", imagePath + elements[0] );
                images.push( [ img, [] ] );

                imageName = elements[0];

              }
              
            }

            // Save landmark dimensions for each image
            if( elements[2] && elements[3] && elements[4] ){

              images[ images.length - 1 ][1].push( [ elements[2] , elements[3] , elements[4] ] );

            }

        }

      });
      
      // Add images to image list
      this.images = this.images.concat(images);
      this.uploadCSVFile = "";
      
    };

    reader.addEventListener( "load", readerEvent.bind( this ), false );
    reader.addEventListener( "error", function( error ){ console.log( error ) } );

    reader.readAsText( csvFile );

  }

  /**
   *  Load current image
   *  
   */
  loadImage( event ){
    
    // Id of clicked image
    let id = event.target.id;

    // Image already loaded or using mirror
    if( this.img && id == this.img.id ) return true;
    if( this.mirror ) return true;

    // Store points for this image, before loading a new image
    if( this.img ){

      let points = this.points.slice();
      this.images[ this.img.id ][1] = points;

    }
    
    // Get clicked image
    this.img = document.getElementById( id );
    
    // Clear Canvas and points
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    this.points.length = 0;

    // Store original image width and height
    this.originalImageWidth = this.img.naturalWidth;
    this.originalImageHeight = this.img.naturalHeight;

    // Set current image width/height to its natural width/height
    this.currentImageWidth = this.originalImageWidth;
    this.currentImageHeight = this.originalImageHeight;

    // Center Image, update image position and draw 
    this.centerImage( this.originalImageHeight );
    this.deltaX = this.centeredDeltaX;
    this.deltaY = this.centeredDeltaY;
    this.ctx.drawImage( this.img,  Math.floor( this.centeredDeltaX ),  Math.floor( this.centeredDeltaY ), this.originalImageWidth, this.originalImageHeight );
    
    // If width bigger than canvas then zoom out
    if( this.originalImageHeight > this.canvas.height ){
      
      this.currentImageHeight = this.canvas.height - 30;
      this.currentImageWidth = this.img.width * this.currentImageHeight / this.img.height;
      this.redrawZoomedCanvas();
      
    }

    // Load current image's points if any
    this.points = this.images[ this.img.id ][1].slice();
    this.points.map( ( point, index ) => {

      // Build point coordinates on the canvas
      let coordinates = this.buildPointCanvasCoordinates( point );

      // Draw point
      this.paintPoint( coordinates.x, coordinates.y, index );

    });

    // Update Selected Image index
    this.selectedImage = id;

  }

  /**
   *  Center image when scrolling and at first load
   *  
   */
  centerImage( currentHeight ){

    // Center of the image currently
		let image_center_x = this.currentImageWidth / 2;
		let image_center_y = currentHeight / 2;

		// Subtract the cavas size by the image center, that's how far we need to move it.
		this.centeredDeltaX = this.canvas.width/2 - image_center_x;
    this.centeredDeltaY = this.canvas.height/2 - image_center_y;
    
  }

  /**
   * Mouse wheel scrolling => zoom in/out
   * 
   *  */
  zoomCanvasEvent( event ){

    event.preventDefault();

    // No Image loaded yet
    if( !this.img ) return true;

    // Wheel data for zooming in
    let delta = event.wheelDelta ? event.wheelDelta / 40 : event.detail ? -event.detail : 0;

    // Zoom In or Out
    if( delta > 0 ){

      this.currentImageWidth = this.currentImageWidth * 2;

      // Image width maximum
      if( this.currentImageWidth > this.originalImageWidth ){

        this.currentImageWidth = this.originalImageWidth;

      }

    }else{

      this.currentImageWidth = this.currentImageWidth / 2;

      // Image width minimum
      if( this.currentImageWidth < 250 ){

        this.currentImageWidth = 250;

      }

    }

    // New Image height keeps the original width/image ratio
    this.currentImageHeight = this.img.height / this.img.width * this.currentImageWidth;

    // Redraw zoomed canvas elements
    this.redrawZoomedCanvas();

  }

  /**
   * Redraw the elements after zooming in
   * 
   *  */
  redrawZoomedCanvas(){

    // Center image
    this.centerImage( this.currentImageHeight );
    
    // Update image current positions
    this.deltaX = this.centeredDeltaX;
    this.deltaY = this.centeredDeltaY;

    // Redraw image
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    this.drawImage();

    // New image width/height is bigger, smaller or equal to actual image width/height
    this.widthRatio = this.currentImageWidth / this.originalImageWidth;
    this.heightRatio = this.currentImageHeight / this.originalImageHeight;

    // Redraw points
    this.points.map( ( point, index ) =>{

      // Update latest width
      point[2] = this.currentImageWidth;

      // Build point coordinates on the canvas
      let coordinates = this.buildPointCanvasCoordinates( point );

      // Draw point
      this.paintPoint( coordinates.x, coordinates.y, index );

    });
    
  }

  /**
   * Start drag event of 
   * a point or image 
   * on canvas
   * 
   *  */
  dragStart( event ){

    // Image not loaded
    if( !this.img ) return true;

    // Do not drag while adding points
    if( this.addPoints ) return true;

    // X and Y click on the canvas
    this.clickX = event.clientX - this.canvas.getBoundingClientRect().left;
    this.clickY = event.clientY - this.canvas.getBoundingClientRect().top;

    // Find if we are trying to move a point and which one
    this.points.some( ( point, index ) => {

      // Normal Coordinates
      let coordinates = this.buildPointCanvasCoordinates( point );

      // Find if the dragging point is within 10 pixel radius of any point
      let diffx = Math.abs( coordinates.x - this.clickX );
      let diffy = Math.abs( coordinates.y - this.clickY );

      if( diffx <= 10 && diffy <= 10 ){

        this.movingPoint = index;
        return true;

      }

    });

    // Moving the whole image
    if( this.movingPoint <= -1 ){
      
      // Mouse clicking positions on the image
      this.imageClickX = this.clickX - this.deltaX;
      this.imageClickY = this.clickY - this.deltaY;

    }

    this.dragging = true;
    
  }

  /**
   * Move image or point while dragging
   * 
   *  */
  dragMove( event ){
    
    if( this.dragging ){

      // Mouse click on the canvas
      this.clickX = event.clientX - this.canvas.getBoundingClientRect().left;
      this.clickY = event.clientY - this.canvas.getBoundingClientRect().top;
      
      // Update image positions when we are moving the whole image
      if( this.movingPoint <= -1 ){

        // Update image positions while dragging        
        this.deltaX = this.clickX - this.imageClickX;
        this.deltaY = this.clickY - this.imageClickY;
        
      }

      // Redraw Image
      this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
      this.drawImage();

      // Draw points
      this.drawMovingPoints();

    }

  }

  /**
   * Draw Moving points, 
   * if dragging whole image or only one point.
   * 
   *  */
  drawMovingPoints(){
    
    this.points.map( ( point, index ) => {

      // Update moving's point coordinates
      if( this.movingPoint == index ){

        point = this.updateMovingPoint( point );

      }

      // Build point coordinates on the canvas
      let coordinates = this.buildPointCanvasCoordinates( point );
      
      // Draw point
      this.paintPoint( coordinates.x, coordinates.y, index );

    });

  }

  /**
   * Update position of Single Moving Point.
   * 
   * Update original width position and set limits
   * 
   *  */
  updateMovingPoint( point ){

    // X image bounds limits
    if( this.clickX < this.deltaX ){

      this.clickX = this.deltaX;

    }else if( this.clickX > this.deltaX + this.currentImageWidth ){

      this.clickX = this.deltaX + this.currentImageWidth;

    }
    
    // Y image bounds limits
    if( this.clickY < this.deltaY ){

      this.clickY = this.deltaY;

    }else if( this.clickY > this.deltaY + this.currentImageHeight ){

      this.clickY = this.deltaY + this.currentImageHeight;
      
    }
    
    let dx = this.clickX - this.deltaX;
    let dy = this.clickY - this.deltaY;

    // Update X and Y on actual image
    point[0] = dx / this.widthRatio;
    point[1] = dy / this.heightRatio;

    return point;

  }

  /**
   * Stop dragging!
   * OR 
   * Add points
   * 
   *  */
  dragStop( event ){

    // Reset flag for dragging image and point
    this.dragging = false;
    this.movingPoint = -1;
    
    // Right Mouse Click
    let keyCode = event.keyCode ? event.keyCode : event.which;
    if( keyCode == 3 ) return true;
    
    // Add points when flag is set to true
    if( this.addPoints ){

      this.addPoint( event );

    }

  }

  /**
   * Right Clicking Canvas Event.
   * 
   * Delete near landmark
   * 
   *  */
  rightClickCanvas( event ){

    event.preventDefault();

    // If no image is loaded or we are dragging image
    if( !this.img ) return true;
    if( this.dragging ) return true;

    // Right mouse click
    this.clickX = event.clientX - this.canvas.getBoundingClientRect().left;
    this.clickY = event.clientY - this.canvas.getBoundingClientRect().top;
    
    // Find which point we want to delete and show the pop up message
    this.points.some( ( point, index ) =>{

      // Point Coordinates on canvas
      let coordinates = this.buildPointCanvasCoordinates( point );

      // Find if the dragging point is within 10 pixel radius of any point
      let diffx = Math.abs( coordinates.x - this.clickX );
      let diffy = Math.abs( coordinates.y - this.clickY );

      if( diffx <= 10 && diffy <= 10 ){

        this.delFromCanvas = index;
        return true;

      }

    });

  }

  /**
   * Resize Canvas Event
   * 
   *  */
  resizeCanvasEvent( event ){

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    if( this.img ){

      this.redrawZoomedCanvas();

    }

  }

  /**
   * Add points on the image
   * 
   * Structure [ dx of natural image width, dy of natural image height, current image width ]
   * 
   *  */
  addPoint( event ){
    
    if( this.dragging ) return true;
    
    // X and Y of mouse click on the canvas
    this.clickX = event.clientX - this.canvas.getBoundingClientRect().left;
    this.clickY = event.clientY - this.canvas.getBoundingClientRect().top;

    // Do not add image outside image bounds
    if( this.clickX < this.deltaX || this.clickX > this.deltaX + this.currentImageWidth ) return true;
    if( this.clickY < this.deltaY || this.clickY > this.deltaY + this.currentImageHeight ) return true;

    // Point's distance from image's origin, 
    // with image's CURRENT width and height
    let dx = this.clickX - this.deltaX;
    let dy = this.clickY - this.deltaY;

    // Point's distance from image's origin, 
    // with image's NATURAL image and width
    let dxOriginalPos = dx / this.widthRatio;
    let dyOriginalPos = dy / this.heightRatio;

    // Add point to array and paint it
    let point = [ dxOriginalPos, dyOriginalPos, this.currentImageWidth ];
    this.points.push( point );
    this.paintPoint( this.clickX, this.clickY, this.points.length - 1 );

  }

  /**
   * Build the point's coordinates on the canvas
   * 
   */
  buildPointCanvasCoordinates( point ){

    // Normal Point Coordinates on canvas
    let dx = point[0] * this.widthRatio;
    let dy = point[1] * this.heightRatio;
    let x = dx + this.deltaX;
    let y = dy + this.deltaY;

    return { x: x, y: y, dx: dx };

  }

  /**
   * Paint Single Point
   * 
   */
  paintPoint( x, y, index ){
    
    // Label
    this.ctx.font = "bold 1em Arial";
    this.ctx.fillStyle = "rgb(0,0,255)";
    this.ctx.fillText( "L" + ( index + 1 ), x, y-5 );

    // Point
    this.ctx.fillStyle = "rgb(255,0,0)";
    this.ctx.fillRect( x, y, 5, 5 );

  }
  
  /**
   *  Mirror Image
   *  
   */
  doMirror(){
    
    // Do not do mirror when adding points or image not loaded
    if( !this.img ) return true;
    if( this.addPoints ) return true;

    // Set mirror flag 
    if( !this.mirror ){

      this.mirror = true;
      this.flip = true;

    }else{

      this.mirror = false;
      this.flip = false;

    }

    // Redraw Image
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    this.drawImage();

    // Update points' positions since we flip on X axis
    this.points.map( ( point, index ) => {

      // Normal Point Coordinates on canvas
      let coordinates = this.buildPointCanvasCoordinates( point );

      // Reversed points on X axis
      point[0] = this.originalImageWidth - point[0];
      coordinates.x = this.deltaX + ( point[2] - coordinates.dx );
      
      this.paintPoint( coordinates.x, coordinates.y, index );

    });

  }

  /**
   *  Save all information as a CSV file.
   *  
   *  For the end user, Specimen, Landmark, 
   *  Image X and Image Y columns only matter.
   */
  doSaveAs(){
    
    if( !this.saveFileName ) return true;
    if( this.mirror ) return true;

    // Store points for current image
    if( this.img ){

      let points = this.points.slice();
      this.images[ this.img.id ][1] = points;

    }

    // Title
    let data = "Specimen,Landmark,Image X,Image Y,Latest Image Width\n";
    
    for( let l = 0; l < this.images.length; l++ ){

      // Image name and point elements
      let imageName = this.images[l][0].title;
      let points = this.images[l][1];

      if( points.length == 0 ){

        data += imageName + ",No Landmarks\n";

      }else{

        // Create points information for each image
        for( let i = 0; i < points.length; i++ ){

          let point = points[i];
          data +=  imageName+ ",L"+ ( i + 1 ) +"," + point[0] + "," + point[1] + "," + point[2] + "\n";
    
        }

      }

      // Empty line
      data += "\n";

    }

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
    dwldLink.setAttribute( "download", this.saveFileName + ".csv" );
    dwldLink.style.visibility = "hidden";

    document.body.appendChild( dwldLink );
    dwldLink.click();
    document.body.removeChild( dwldLink );

    this.savePopUpInfo = false;

  }

  /**
   * Remove point from the canvas 
   * and hide message
   * 
   *  */
  deleteFromCanvas(){

    this.removePoint( this.delFromCanvas );
    this.delFromCanvas = -1;

  }

  /**
   *  Remove Point
   *  
   */
  removePoint( index ){

    // Remove point from array
    this.points.splice( index, 1 );

    // Redraw Image
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    this.drawImage();

    // Redraw points
    this.points.map( ( point, index ) => {

      // Build point coordinates on the canvas
      let coordinates = this.buildPointCanvasCoordinates( point );
      
      // Draw point
      this.paintPoint( coordinates.x, coordinates.y, index );

    });

  }

  /**
   *  Rearrange Landmarks
   *  
   */
  moveLandmark( event: CdkDragDrop<string[]> ){

    // Move item in points list/array and re-arrange order
    moveItemInArray( this.points, event.previousIndex, event.currentIndex );

    // Redraw Image
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    this.drawImage();

    // Redraw points
    this.points.map( ( point, index ) => {

      // Build point coordinates on the canvas
      let coordinates = this.buildPointCanvasCoordinates( point );
      
      // Draw point
      this.paintPoint( coordinates.x, coordinates.y, index );

    });

  }

  /**
   *  Remove Image from the list
   *  
   */
  removeImage( index ){

    // Remove image from the list
    this.images.splice( index, 1 );

    if( this.img ){

      // Clear canvas if we removed the selected image
      if( index == this.img.id ){

        // Clear canvas and reset image related properties
        this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.points.length = 0;
        this.img = "";
        this.selectedImage = -1;

        // Mirroring set to default
        this.mirror = false;
        this.flip = false;

        // Adding points set to default
        this.addPoints = false;
        this.togglePoints = false;
        this.canvas.classList.remove("addPoint");
        
      }

    }

  }

  /**
   *  Draw Image.
   * 
   * Check for mirroring before drawing the actual image.
   *  
   */
  drawImage(){

    let scaleFactor = 1;
    let posX = this.deltaX;

    // When mirroring original image scale by -1 on X axis
    // and resposition image according to its width
    if( this.mirror ){

      scaleFactor = -1
      posX = ( -1 * this.currentImageWidth ) - this.deltaX;

    }

    this.ctx.scale( scaleFactor, 1 );
    this.ctx.drawImage( this.img,  Math.floor( posX ),  Math.floor( this.deltaY ), this.currentImageWidth, this.currentImageHeight );

    // Reset the transformation matrix using identity matrix.
    // This way we do not alter the coordinates on X axis
    this.ctx.setTransform( 1, 0, 0, 1, 0, 0 );

  }

  /**
   * Add points or not
   * 
   *  */
  toggleAddPoints(){

    // Do not add points when mirrored
    // Or image not loaded
    if( this.mirror ) return true;
    if( !this.img ) return true;

    this.addPoints = !this.addPoints;

    if( this.addPoints ){

      this.togglePoints = true;
      this.canvas.classList.add("addPoint");

    }else{

      this.togglePoints = false;
      this.canvas.classList.remove("addPoint");

    }

  }

  /**
   *  Show Save Popup
   *  
   */
  showSavePopUpInfo(){

    if( !this.img ) return true;

    this.savePopUpInfo = true;

  }
  
}
