const Cell = require ( './lib/cell.js');
const Region = require ('./lib/region.js');
const Grid = require('./lib/grid.js');
const Sequence = require ('./lib/sequence.js');
const Sequencer = require('./lib/sequencer.js');

const InputManager = require('./lib/inputmanager.js');
const Mediator = require('./lib/mediator.js');
const OutputManager = require('./lib/outputmanager.js');

var thegrid = new Grid();
var sequencer = new Sequencer();

var input = new InputManager();
var mediator = new Mediator( thegrid , sequencer);
var output = new OutputManager( thegrid );

var colours = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'indigo', 'violet'];

var defaultNotes = [60, 61, 62, 63, 64, 65, 66];
var defaultSequenceMode = 'loop'; /// notes pattern-loop pattern-beatloop pattern-sequenceloop


// TODO use clearEngine intead? 
/// send startup message to clear grid and sequencer
for( var i = 0; i < 8; i++) {
	outlet(0, 'setVoice', i );
	outlet(0, 'what');
}

/*
var results = initAbletonPush1(); // returns a list of messages to initialize buttons

for ( m of results ){
	Max.outlet('midi-output', m );
}
*/
// =========== end setup

// get midi input 
function note (n,v){

	var newcell = input.input( n, v ); 
    if( newcell === undefined){
        return; 
    }
	if ( newcell === null ){
		var messages = mediator.input();

        if( messages === undefined ){
            return;
        }

        for(var i = 0; i < messages.length; i++){
            outlet(0, messages[i].channel, messages[i].data );
        }
	}else{
		mediator.push( newcell );
	}
}


function cell(x, y, v){
	var newcell = input.cellInput(x,y,v);
	if( newcell === undefined){
        return; 
    }
	if ( newcell === null ){
		var messages = mediator.input();

        if( messages === undefined ){
            return;
        }

        for(var i = 0; i < messages.length; i++){
            outlet(0, messages[i].channel, messages[i].data );
            console.log( messages[i] );
        }
	}else{
		mediator.push( newcell );
	}
}

/// get voice and index from sequencer and prepare MIDI for hardware display
function syncstep ( voiceNumber, sequenceIndex ) {
	var r = thegrid.regions[ voiceNumber ]; // returns the region 
    console.log( "received voice number " + voiceNumber + " grid length " + thegrid.regions.length);

    var messages = mediator.sync( voiceNumber, sequenceIndex ); 
    for( var i = 0; i < messages.length; i++){
        outlet(0, messages[i].channel, messages[i].data ); 
    }

    var messages = mediator.syncControlSurface( voiceNumber, sequenceIndex );
    for( var i = 0; i < messages.length; i++){
        outlet(0, messages[i].channel, messages[i].data ); 
    }

}

function mode (m){
	mediator.setMode( m );
    console.log( mediator.mode );
}

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
			messages.push( [...msg] );
		}
		
		return messages;
}
//Max.addHandler("clearEngine", i => {
	
function clearEngine(){
    console.log('\n Clearing Engine \n' );
    for( var i = 0; i < 8; i++) {
        outlet(0, 'setVoice', i );
        outlet(0, 'what');	
    }
}

function setCurrentNoteData(n,v,p,m) {
    mediator.setCurrentNoteData(n,v,p,m);
}
