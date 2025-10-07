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
var colourNumbers = [127, 3, 13, 21, 33, 45, 49];

var defaultNotes = [60, 61, 62, 63, 64, 65, 66];
var defaultSequenceMode = 'loop'; /// notes pattern-loop pattern-beatloop pattern-sequenceloop

// Sequence mode tracking
var sequenceModes = [
	"QUARTER",
	"QUARTER_TUPLET",
	"EIGHTH",
	"EIGHTH_TUPLET",
	"SIXTEENTH",
	"SIXTEENTH_TUPLET",  // default (button 5)
	"THIRTYSECOND",
	"THIRTYSECOND_TUPLET"
];
var currentSequenceMode = 5;  // Default to SIXTEENTH_TUPLET


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

function output_channel(channel){
	console.log("output_channel " + channel + ": " + sequenceModes[channel]);

	// Update current sequence mode
	currentSequenceMode = channel;

	// Update button LEDs - highlight selected mode
	updateSequenceModeButtons();

	// TODO: When selectedSequence is implemented:
	// - Apply this mode to the selected sequence
	// - Update the sequence's timing/subdivision
}

function updateSequenceModeButtons(){
	// Send LED updates for all 8 Scene Launch buttons
	for(var i = 0; i < 8; i++){
		var color = (i === currentSequenceMode) ? 10 : 1;  // 10 = selected, 1 = unselected
		outlet(0, 'scene-button', i, color);
	}
}

function device_selected(isSelected){
	console.log("formachron: device_selected=" + isSelected);

	// When device is selected, redraw all regions
	if(isSelected === 1){
		for(var i = 0; i < thegrid.regions.length; i++){
			// Skip null entries from removed regions
			if(thegrid.regions[i]){
				var region = thegrid.regions[i];

				// Draw all cells in this region with its color
				for(var j = 0; j < region.cells.length; j++){
					outlet(0, 'control-surface', region.cells[j].x, region.cells[j].y, colourNumbers[i]);
				}
			}
		}

		// Light up Scene Launch buttons to show current sequence mode
		updateSequenceModeButtons();
	}
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
