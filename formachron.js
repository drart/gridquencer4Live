const path = require('path');
const Max = require('max-api');

var colours = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'indigo', 'violet'];
var mode = 0;

const Cell = require ( './lib/cell.js');
const Region = require ('./lib/region.js');
const Grid = require('./lib/grid.js');
const Sequence = require ('./lib/sequence.js');
// TODO rename syncmanager to inputmanager
// const InputManager = require('./lib/inputmanager.js');

class SyncManager {
	constructor( g ){
		this.mode = 0; // input, select, shift, mute, move regions
		this.padsDown = [];
		this.grid = g;
	}
	
	input( c ){
		console.log( "sync input is: " + c );
		if(this.mode === 0){ // entry mode - default
			if(this.padsDown.length === 2 || this.padsDown.length === 1){
				console.log('new region with 1 or two touches');

				var r = new Region(this.padsDown); 

				var resultingRegion = this.grid.addRegion(r);
				if(resultingRegion === undefined){
					console.log('region add failed');
					return;/// if region overlaps with another in a non-modifiable way then return
				}
				console.log('region added ' + resultingRegion.cells.length + ' cells long');
				var regionVector = resultingRegion.toVector();
				var regionIndex = this.grid.getRegionIndex(resultingRegion);

				Max.outlet( 'setVoice', regionIndex );
				Max.outlet( 'createSequence', ...regionVector );

				sequences[regionIndex] = new Sequence();
				var whatindices = sequences[regionIndex].vectorToMatches( regionVector );
				Max.outlet( 'what', ...whatindices );
				
				this.clear();
				
				return [resultingRegion.toVectorWithOrigin(), regionIndex];
			}	
		}
		/*
		if(this.mode === 2){ // select mode
			for(var i = 0; i < thegrid.regions.length; i++){
				if(thegrid.regions[i].contains(c)){
					console.log(i); /// TODO SELECT THE REGION OR SELECT THE CELL?
				}
			}
		}
		*/
		if(this.mode === 1){ // shift mode
			for(var i = 0; i < thegrid.regions.length; i++){
				console.log('checking grid for cell');
				if(thegrid.regions[i].containsCell(c)){
					var shift = thegrid.regions[i].cellIndex(c);
					var phaseshift = sequences[i].getMatches()[shift];

					console.log("the shift is: " + shift + " " + phaseshift);
					Max.outlet( 'setVoice', i );
					Max.outlet( 'phaseShift', phaseshift );
					return;
				}
			}
		}
	}
	
	changeMode ( m ){
		this.mode = m;
	}	
	clear (){
		this.padsDown = [];
	}
	push ( c ){
		this.padsDown.push( c );
	}
}

class OutputManager{
	constructor( g ){
		this.shapes = []; // this is a cached version of the region shapes
		this.grid = g;
	}

	process( vectorWithOrigin, index ){

		var r = this.grid.regions[index];

		if(this.shapes[index] === undefined){ // add region
			for(var i = 0 ; i < r.cells.length; i++){
				var celllist = [r.cells[i].x, r.cells[i].y,  colours[index] ];
				// TODO 
				//outlet(3, celllist);
			}
		}else{ // modify the region
			var c = new Cell(vectorWithOrigin[0], vectorWithOrigin[1]);
			for(var i = 2; i < vectorWithOrigin.length; i++){

				if(vectorWithOrigin[i] !== this.shapes[index][i]){
					if(vectorWithOrigin[i] > this.shapes[index][i]){
						for(var j = this.shapes[index][i]; j < vectorWithOrigin[i]; j++){
							var x = vectorWithOrigin[0] + j;
							var y = vectorWithOrigin[1] + i - 2;
							var celllist = [x, y, colours[index]];
							// TODO
							//outlet(3, celllist);
						}
					}else{
						for(var j = vectorWithOrigin[i]; j < this.shapes[index][i]; j++){
							var x = vectorWithOrigin[0] + j;
							var y = vectorWithOrigin[1] + i - 2;
							var celllist = [x, y, "grey"];
							// TODO - also set this to 0? 
							//outlet(3, celllist);
						}
					}
				}
			}
		}

		this.shapes[index] = vectorWithOrigin;
	}
}


var thegrid = new Grid();
var sync = new SyncManager( thegrid );
var output = new OutputManager( thegrid );
var sequences = [];

/// send startup message to clear grid and sequencer
for( var i = 0; i < 8; i++) {
	Max.outlet('setVoice', i );
	Max.outlet('what');
}

// get midi input 
Max.addHandler("note", (n,v) => {
	var c;
	if( v === 0 ){
		var result = sync.input();
		// TODO 
		// outputmanager.process( result );
		console.log( result );
	}else{
		c = new (Cell);
		c.x = (n - 36) % 8;
		c.y = Math.floor(( n - 36 ) / 8 );
		sync.push( c );
	}
});

Max.addHandler("control", (cc, val) => {
	//inputmanager.control( cc, val );
});

/// get voice and index from sequencer and prepare MIDI for hardware display
Max.addHandler("syncstep", (voiceNumber, sequenceIndex) => {
	var r = thegrid.regions[ voiceNumber ];
	//console.log( r );

	var previousIndex = sequenceIndex - 1;
	if (previousIndex === -1 ){
		previousIndex = r.cells.length - 1; // todo bodge
	}

	Max.outlet( 'outlet', r.cells[sequenceIndex].x, r.cells[sequenceIndex].y, 'white' );
	Max.outlet( 'outlet', r.cells[previousIndex].x, r.cells[previousIndex].y,  colours[sequenceIndex]);
});

Max.addHandler("mode", m => {
	//sync.mode( m );
});


Max.addHandler("remove", i => {
	Max.outlet('setVoice', i );
	Max.outlet('what');	
});