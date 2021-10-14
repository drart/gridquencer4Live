inlets = 2;
outlets = 2;

var Cell = require("cell");
var Region = require("region");
var Grid = require("grid");
//var GridSequence = require("gridsequence");

var grid = new Grid.Grid();
clearPushGrid();
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
		var resultingRegion = grid.addRegion( newRegion );
	
		if( resultingRegion ){
			//log('hooray');
			var clip = createClip( resultingRegion, grid.regions.length-1 );
			clip.call("fire");

			updateMatrixVisuals(grid.thegrid);
			updatePushController(grid.thegrid);

		}else{
			log('whoopsie');
		}

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


function updateMatrixVisuals(cells){
	
	cells.forEach(function(cell){
		if( cell ) {
			outlet(1, "setcell", cell.cell.x + 1, cell.cell.y + 1, 1 );
		}

		//else{
		//	outlet(1, "setcell", cell.cell.x + 1, cell.cell.y + 1, 0 );
		//}
	});
}

function updatePushController(cells){

	cells.forEach(function(cell){
		
		if ( cell ) {
			var notenumber = (cell.cell.y * 8 ) + cell.cell.x + 36 ;
			outlet(0, [144, notenumber, 1]);
		} 
		//else{
		//	outlet(0, [144, notenumber, 0]);
		//}
	});
}


function removeSequence(){

	/// identify sequence
	/// set id to 0

}

function clearPushGrid(){

	for (var i = 0; i < 8 * 8; i++){
		outlet(0, [144, i + 36, 0]);
	}
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
