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

var thegrid = new Grid();

var sync = new SyncManager( thegrid );
//var output = new OutputManager();
var sequences = [];

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

	// output midi for current step
	// output midi for previous step

	Max.outlet('something', voiceNumber, sequenceIndex);
});
