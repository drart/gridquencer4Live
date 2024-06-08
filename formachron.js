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
	
	input( c ){ // c is often called with undefined
		//console.log( "sync input is: " + c );
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
				sequences[regionIndex].setVector( regionVector );
				//console.log( sequences[regionIndex] );
				var whatindices = sequences[regionIndex].getMatches();
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
			var c = this.padsDown[0]; // TODO fix to get the input from sync call
			for(var i = 0; i < thegrid.regions.length; i++){
				console.log('checking grid for cell');
				if(this.grid.regions[i].containsCell(c)){
					var shift = thegrid.regions[i].cellIndex(c);
					var phaseshift = sequences[i].getMatches()[shift];

					console.log("the shift is: " + shift + " " + phaseshift);
					Max.outlet( 'setVoice', i );
					Max.outlet( 'phaseShift', phaseshift );
					
					/*
					// send out shift index
					let vec = sequences[i].getVector();
					Max.outlet('sequenceBeats', vec.length);
					let sum = 0; 
					for( let k = 0; k < vec.length; k++){
						sum += vec[k];
					}
					Max.outlet('sequenceEvents');
					*/
					return;
				}
			}
		}
		if(this.mode === 3){ // mute mode
			var c = this.padsDown[0]; // todo fix 
			for( var i = 0; i < this.grid.regions.length; i++){
				if(this.grid.regions[i].containsCell(c)){

					let index = this.grid.regions[i].cellIndex( c ) ;
					if( sequences[i].getProbability( index ) === 0 ){
						sequences[i].setProbability( index, 1 );
					}else{
						sequences[i].setProbability( index, 0 );
					}
					var probs = sequences[i].getProbabilities();
					Max.outlet('setVoice', i );
					Max.outlet('prob', ...probs );
					this.clear();// todo fix
					return;
				}
			}
		}
	}
	
	setMode ( m ){
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

	process( args ){ // todo fix the return from syncmanager

		var index = args.pop();
		var vectorWithOrigin = args;

		console.log ( 'the args to process are: ' + args );
		console.log( 'the index is: ' + index );

		/*
		/// there is a problem with this bit
		if( vectorWithOrigin  === undefined ){
			console.log('doing nothing in output manager');
			return;
		}
		*/

		var r = this.grid.regions[index];
		console.log( r );


		if(this.shapes[index] === undefined){ // add region
			console.log('create a vector region' );
			for(var i = 0 ; i < r.cells.length; i++){
				var celllist = [r.cells[i].x, r.cells[i].y,  colours[index] ];
				// TODO 
				var data = CellToPushNote( r.cells[i].x, r.cells[i].y, colours[index] );
				var msg = [ 144, data[0], data[1] ];
				console.log( msg );
				Max.outlet('midi-output', msg);
			}
		}else{ // modify the region
			console.log('modify a region' );
			var c = new Cell(vectorWithOrigin[0], vectorWithOrigin[1]);
			for(var i = 2; i < vectorWithOrigin.length; i++){

				if(vectorWithOrigin[i] !== this.shapes[index][i]){
					if(vectorWithOrigin[i] > this.shapes[index][i]){
						for(var j = this.shapes[index][i]; j < vectorWithOrigin[i]; j++){
							var x = vectorWithOrigin[0] + j;
							var y = vectorWithOrigin[1] + i - 2;
							var celllist = [x, y, colours[index]];
							// TODO

							var msg = CellToPushNote( x, y, colours[index] );
							Max.outlet('midi-output', msg);
						}
					}else{
						for(var j = vectorWithOrigin[i]; j < this.shapes[index][i]; j++){
							var x = vectorWithOrigin[0] + j;
							var y = vectorWithOrigin[1] + i - 2;
							var celllist = [x, y, 0];
							var msg = CellToPushNote( x, y, colours[index] );
							msg[2] = 0;
							// TODO - also set this to 0? 
							//outlet(3, celllist);
							Max.outlet('midi-output', msg);
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

var results = initAbletonPush1();

for ( m of results ){
	Max.outlet('midi-output', m );
}


// get midi input 
Max.addHandler("note", (n,v) => {
	
	if ( n > 99 || n < 36){
		console.log('note out of range');
		return;
	}
	var c;
	if( v === 0 ){
		console.log('note off');
		var result = sync.input(); // could be undefined
		// TODO 
		//output.process( result );
	}else{
		c = new (Cell);
		c.x = (n - 36) % 8;
		c.y = Math.floor(( n - 36 ) / 8 );
		console.log(c);
		sync.push( c );
	}
});

Max.addHandler("control", (cc, val) => {
	//inputmanager.control( cc, val );
});

/// get voice and index from sequencer and prepare MIDI for hardware display
Max.addHandler("syncstep", ( voiceNumber, sequenceIndex ) => {
	var r = thegrid.regions[ voiceNumber ];

	var previousIndex = sequenceIndex - 1;
	if (previousIndex === -1 ){
		previousIndex = r.cells.length - 1; // todo bodge
	}

	Max.outlet( 'outlet', r.cells[sequenceIndex].x, r.cells[sequenceIndex].y, 'white' );
	Max.outlet( 'outlet', r.cells[previousIndex].x, r.cells[previousIndex].y,  colours[voiceNumber]);
	
	currentNote  = 	CellToPushNote( r.cells[sequenceIndex].x, r.cells[sequenceIndex].y, 'white' );
	previousNote = 	CellToPushNote(  r.cells[previousIndex].x, r.cells[previousIndex].y,  colours[voiceNumber] );
	
	Max.outlet('midi-output', [144, previousNote[0], previousNote[1] ]);
	Max.outlet('midi-output', [144, currentNote[0],  currentNote[1]  ]);
});

Max.addHandler("mode", m => {
	sync.setMode( m );
	console.log( sync.mode) ;
});


Max.addHandler("remove", i => {
	Max.outlet('setVoice', i );
	Max.outlet('what');	
});

function initAbletonPush1(){
		var msg = [];
		var cc = 176;
		var note = 144;
		
		var messages = [];
		var ccs = [36, 37, 38, 39, 40, 41, 42, 43, 85, 49, 50, 85 ];
		
		
		for( let i = 0; i < 64; i++){
			msg[0] = note;
			msg[1] = 36 + i;
			msg[2] = 0;
			messages.push( [...msg] );
		}
		
		for( let i = 0; i < ccs.length; i++){
			msg[0] = cc;
			msg[1] = ccs[i];
			msg[2] = 1;
			messages.push( [...msg])
		}
		
		return messages;
}


function CellToPushNote(x, y, colour){
	var note = y*8 + x + 36; 
	var outputcolour = 3;
	switch(colour){
		case 'white':
			outputcolour = 3;
			break;
		case 'red': 
			outputcolour = 120;
			break;
		case 'orange':
			outputcolour = 60;
			break;
		case 'yellow':
			outputcolour = 13;
			break;
		case 'green':
			outputcolour = 21;
			break;
		case 'cyan':
			outputcolour = 33;
		case 'blue':
			outputcolour = 45;
			break;
		case 'indigo':
			outputcolour = 49;
		default:
			break;
	}
	
	return( [note, outputcolour] );
}
