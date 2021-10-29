inlets = 2;
outlets = 2;

var Cell = require("cell");
var Region = require("region");
var Grid = require("grid");

var grid = new Grid.Grid();
var padsDown = [];
var thisTrackID, selectedTrackID;
var myPush2;
var ButtonMatrix;

function setup(){
	var liveApp = new LiveAPI(null, 'live_app');	
	var controlSurfaces = liveApp.getcount('control_surfaces');

	for (var i = 0; i < controlSurfaces; i++){
		var controlSurface = new LiveAPI(null, "control_surfaces " + i );
		if ( controlSurface.type == "Push2" ){
			myPush2 = controlSurface;
			log('Found a Push2');	

			ButtonMatrix = new LiveAPI( buttonMatrixListener, "control_surfaces " + i + " controls 200" );
			ButtonMatrix.property = "value";
		
			break;
		}
	}

	var thisTrack = new LiveAPI( function(args){
		thisTrackID = Number( args[1] );
	});
	thisTrack.path = "this_device canonical_parent";
	thisTrack.mode = 1;	

	var selectedTrack = new LiveAPI( function(args){
		selectedTrackID = Number( args[1] );

		if( trackId === selectedTrackID ){ /// seems to be off by 1? 
			log('this track');
		}else{
			log('not this track');
		}
	});
	selectedTrack.path = "live_set view selected_track";
	selectedTrack.mode = 1;


	outlet(1, 'clear');
}



function buttonMatrixListener( args ){
	log( args ); // "value", velocity, x, y, 1
	
	if( args.length === 5){
		if( args[1] > 0 ){
			outlet(1, "setcell", args[2] +1, 8-args[3], 1);
			ButtonMatrix.call('send_value', args[2], args[3], 122 );
		}else{
			outlet(1, "setcell", args[2] +1, 8-args[3], 0);
			ButtonMatrix.call('send_value', args[2], args[3], 0 );
		}
	}
	
}

function grabButtonMatrix(){
	myPush2.call('grab_control', 'Button_Matrix');
}


function releaseButtonMatrix(){
	myPush2.call('release_control', 'Button_Matrix');
}


function midievent(){

	var midimsg = arrayfromargs(arguments);

	if (midimsg[0] === 144){ // NoteOn
		outlet(0, [144, midimsg[1], 60]);
				
		addCell(midimsg);
	}
	
	if (midimsg[0] === 128){// NoteOff
		//outlet(0, [144, midimsg[1], 0]);	

		if ( padsDown.length === 0 ){
			return;
		}
		
		var newRegion = createRegion( padsDown );
		var resultingRegion = grid.addRegion( newRegion );
	
		if( resultingRegion ){
			var clip = createClip( resultingRegion, grid.regions.length-1 );
			//clip.call("fire");
		}else{
			log('whoopsie');
		}
		
		
		updateMatrixVisuals();
		updatePushController();
		padsDown = [];
	}	
}

/// todo fix this for better set management
function createClip(newRegion, trackSlot){

	var path = "live_set tracks 0 clip_slots " + trackSlot;
	var clippath = path + " clip";
	var clipSlot = new LiveAPI( path ); /// todo check to see track has right number of clip_slots create new scene? 
	
	var hasclip = clipSlot.get("has_clip");
	if( hasclip == 1){
		log('slot has a clip');
		clipSlot.call("delete_clip");
	}else{
		log('clip does not have a slot');
	}
	
	var newnotes = newRegion.toNotes();
	//log( newnotes );

	clipSlot.call("create_clip", newRegion.beats);
	var clip = new LiveAPI(clippath);
	clip.call("add_new_notes", newnotes);
	clip.set("loop_end", newRegion.beats)

	return clip;
}

function addCell( midimsg ){
	var newCell = new Cell.Cell();
	newCell.fromMIDINote( midimsg );

	padsDown.push( newCell );
}

function createRegion( padsdown ){
	
	var region = new Region.Region();
	region.addCells( padsdown );
	
	return region;
}


function updateMatrixVisuals(){
	
	outlet(1, 'clear');
	grid.regions.forEach(function(region){
		region.rows.forEach(function(row){
			row.forEach(function(cell){
				outlet(1, "setcell", cell.x +1, cell.y+1, 1);
			});
		});
	});
}

function updatePushController(){
	clearPushGrid();
	
	grid.regions.forEach(function(region, regionIndex){
		region.rows.forEach(function(row){
			row.forEach(function(cell){
				outlet(0, [144, cell.y*8 + cell.x + 36, regionIndex+1]);
			});
		});
	});
	
}

function clearPushGrid(){
	for (var i = 0; i < 8 * 8; i++){
		outlet(0, [144, i + 36, 0]);
	}
}


/// cite this gem properly
function log() {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
      post(s);
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}
