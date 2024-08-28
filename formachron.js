const path = require('path');
const Max = require('max-api');

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

var mode = 0;
var colours = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'indigo', 'violet'];

/// send startup message to clear grid and sequencer
for( var i = 0; i < 8; i++) {
	Max.outlet('setVoice', i );
	Max.outlet('what');
}

var results = initAbletonPush1(); // returns a list of messages to initialize buttons

for ( m of results ){
	Max.outlet('midi-output', m );
}

// get midi input 
Max.addHandler("note", (n,v) => {

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
            Max.outlet( messages[i].channel, messages[i].data );
            //console.log( messages[i] );
        }
	}else{
		mediator.push( newcell );
	}
});

Max.addHandler("control", (cc, val) => {
	//var response = inputmanager.control( cc, val );
    //mediator.input( response );
});

/// get voice and index from sequencer and prepare MIDI for hardware display
Max.addHandler("syncstep", ( voiceNumber, sequenceIndex ) => {
	var r = thegrid.regions[ voiceNumber ];

	var previousIndex = sequenceIndex - 1;
	if (previousIndex === -1 ){
		previousIndex = r.cells.length - 1; // todo bodge
	}

    if ( sequenceIndex >= r.cells.length ){ // todo big bodge
        return;
    }

    //console.log('call mediator sync');
    var messages = mediator.sync( voiceNumber, sequenceIndex ); 
    for( var i = 0; i < messages.length; i++){
        //console.log( messages[i] );
        Max.outlet( messages[i].channel, messages[i].data ); 
        //console.log('lkajsdflkjaklfja');
    }

	
    /*
	currentNote  = 	CellToPushNote( r.cells[sequenceIndex].x, r.cells[sequenceIndex].y, 'white' );
	previousNote = 	CellToPushNote(  r.cells[previousIndex].x, r.cells[previousIndex].y,  colours[voiceNumber] );
	
	Max.outlet('midi-output', [144, previousNote[0], previousNote[1] ]);
	Max.outlet('midi-output', [144, currentNote[0],  currentNote[1]  ]);
    */
});

Max.addHandler("mode", m => {
	mediator.setMode( m );
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
			messages.push( [...msg] );
		}
		
		return messages;
}


// todo put this in the mediator
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
