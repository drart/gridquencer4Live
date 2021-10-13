inlets = 2;
outlets = 2;

var Cell = require("cell");
var Region = require("region");
var Grid = require("grid");
//var GridSequence = require("gridsequence");

var grid = new Grid.Grid();

var padsDown = [];

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
		var regionDidAdd = grid.addRegion( newRegion );
	
		if( regionDidAdd){
			log('hooray');
		}else{
			log('whoopsie');
		}

		var clip = createClip( newRegion, grid );
		//addNotesToGrid( clip, grid ); 
		clip.call("fire");

		updateMatrixVisuals(grid.thegrid);
		updatePushController(grid.thegrid);

		padsDown = [];
	}	
}

/// todo fix this for better set management
function createClip(newRegion, grid){

	var path = "live_set tracks 0 clip_slots " + (grid.regions.length - 1);
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
	clip.call("add_new_notes", newnotes );

	return clip;
}


function addNotesToGrid( clip, grid ){
	// map notes to grid? 	
	// get the notes and their ids? 
	log( clip.call("get_notes_extended", 0, 128, 0, newRegion.beats ) );
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


function updateMatrixVisuals(cells){
	
	cells.forEach(function(cell){
		if( cell ) {
			outlet(1, "setcell", cell.cell.x + 1, cell.cell.y + 1, 1 );
		}
	});
}

function updatePushController(cells){

	cells.forEach(function(cell){
		if ( cell ) {

			var notenumber = (cell.cell.y * 8 ) + cell.cell.x + 36 ;
			outlet(0, [144, notenumber, 1]);
		} 
	});
}


function removeSequence(){

	/// identify sequence
	/// set id to 0

}



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



/*

//Proof of concept for
		duh = new LiveAPI(function(args){
				//post(args[1].toString());
				var clippos = args[1];

				if ( clippos < 2.5 ){
					outlet(1, "setcell", 8, 8, 1 );
				}else{
					outlet(1, "setcell", 8, 8, 0 );
				}

			}, 
			"live_set tracks 0 clip_slots 0 clip"
		);
		duh.property = "playing_position";
		//duh.call("fire");
		
		
		
		*/
