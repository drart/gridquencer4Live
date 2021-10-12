inlets = 2;
outlets = 2;

var Cell = require("cell");
var Region = require("region");
var Grid = require("grid");


var grid = new Grid.Grid();


var padsDown = [];
var sequences = [];

 

function bang(){



}


function midievent(){

	var midimsg = arrayfromargs(arguments);

	if (midimsg[0] === 144){ // NoteOn
		outlet(0, [144, midimsg[1], 60]);
				
		addCell(midimsg);
	}
	
	if (midimsg[0] === 128){// NoteOff
		outlet(0, [144, midimsg[1], 0]);	

		if ( padsDown.length === 0 ){
			return;
		}
		
		var newRegion = createRegion( padsDown );
		grid.addRegion( newRegion );
		createClip( newRegion, grid );

		//updateMatrixVisuals(grid.thegrid);
		//updatePushController(grid.thegrid);

		padsDown = [];

	}	
}


function createClip(newRegion, grid){

	var path = "live_set tracks 0 clip_slots " + (grid.regions.length - 1);
	var clippath = path + " clip";
	var clipSlot = new LiveAPI( path ); /// check to see track has right number of clip_slots create new scene? 
	if( clipSlot.get("has_clip")   === true){
		log('slot has a clip');
		clipSlot.call("delete_clip");
	}else{
		log('clip does not have a slot');
	}
	clipSlot.call("create_clip", 5);
	var clip = new LiveAPI(clippath);
	
	
	
	/// add notes to clip
	var newnotes = newRegion.toNotes();
	log( newnotes );

	clip.call("add_new_notes", newnotes );
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


/// should reflect the grid? 
function updateMatrixVisuals(cells){
	
	cells.forEach(function(cell){
		outlet(1, "setcell", cell.x + 1, cell.y + 1, 0 );
	});
}

function updatePushController(cells){

	cells.forEach(function(cell){
		outlet(0, [144, 60, 1]);
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
