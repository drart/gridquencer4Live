const Region = require('./region.js');
const Sequence = require('./sequence.js');

var colours = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'indigo', 'violet'];
var colourNumbers = [127, 3, 13, 21, 33, 45, 49];

class Mediator {
    constructor( g , s){
        this.mode = 0; // input, select, shift, mute, move regions
        this.padsDown = [];
        this.grid = g; // reference to the main grid
        this.seq = s; // 
        this.addMode = 'sync'; // or 'immediate'
    }

    input( c ){ // bug? c is often called with undefined -- todo check is if this is still the case
        //console.log( "sync input is: " + c );

        var messages = [];

        if(this.mode === 0){ // entry mode - default
            if(this.padsDown.length === 2 || this.padsDown.length === 1){
                console.log('new region with 1 or two touches');

                var r = new Region( [...this.padsDown] ); // create a shallow copy of the padsdown array
                this.clear();

                if( this.grid.checkRegion ( r ) === false ){
                    console.log('region add failed');
                    return messages;/// if region overlaps with another in a non-modifiable way then return
                }

                var resultingRegion;
                if( this.addMode === 'sync' ) { 
                    resultingRegion = this.grid.addRegion(r);
                    //resultingRegion = this.grid.tryAddRegion(r);
                }else{
                    resultingRegion = this.grid.addRegion(r);
                }

                console.log('region added ' + resultingRegion.cells.length + ' cells long');
                var regionVector = resultingRegion.toVector();
                var regionIndex = this.grid.getRegionIndex(resultingRegion);

                messages.push({channel: 'setVoice', data: regionIndex});
                messages.push({channel: 'createSequence', data: [...regionVector ]});

                this.seq.sequences[regionIndex] = new Sequence(); // todo modify sequence when region already exists
                this.seq.sequences[regionIndex].setVector( regionVector );

                var whatindices = this.seq.sequences[regionIndex].getMatches();
                messages.push({ channel: 'what', data: [...whatindices ]});

                for( var i = 0; i < resultingRegion.cells.length; i++){
                    var currentNote = CellToPushNote( resultingRegion.cells[i].x, resultingRegion.cells[i].y, colours[regionIndex]);
                    messages.push({ channel: 'midi-output', data: [144, currentNote[0], currentNote[1] ]});
                    messages.push({ channel: 'control-surface', data: [resultingRegion.cells[i].x, resultingRegion.cells[i].y, colourNumbers[regionIndex] ] }); 
                }

                var unusedCells = resultingRegion.removedCells;
                for ( var i = 0; i < unusedCells.length; i++){
                    var currentNote = CellToPushNote( unusedCells[i].x, unusedCells[i].y, 0);
                    messages.push({ channel: 'midi-output', data: [144, currentNote[0], 0 ]});
                    messages.push({ channel: 'control-surface', data: [ unusedCells[i].x, unusedCells[i].y, 0]});
                }
                resultingRegion.removedCells = [];

                return messages;

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
            var messages = [];
            var c = this.padsDown[0]; 
            for(var i = 0; i < this.grid.regions.length; i++){
                console.log('checking grid for cell');
                if(this.grid.regions[i].containsCell(c)){
                    var shift = this.grid.regions[i].cellIndex(c);
                    var phaseshift = this.seq.sequences[i].getMatches()[shift];

                    const regionIndex = i; 
                    messages.push({channel: 'setVoice', data: regionIndex});
                    messages.push({ channel: 'phaseShift', data: phaseshift});
                    console.log("the shift is: " + shift + " " + phaseshift);
                    /*
                    Max.outlet( 'setVoice', i );
                    Max.outlet( 'phaseShift', phaseshift );

                    // send out shift index
                    let vec = sequences[i].getVector();
                    Max.outlet('sequenceBeats', vec.length);
                    let sum = 0; 
                    for( let k = 0; k < vec.length; k++){
                        sum += vec[k];
                    }
                    Max.outlet('sequenceEvents');
                    */
                    this.clear();
                    return messages;
                }
            }
        }
        if(this.mode === 3){ // mute mode
            var c = this.padsDown[0]; 
            var messages = [];
            for( var i = 0; i < this.grid.regions.length; i++){
                if(this.grid.regions[i].containsCell(c)){

                    let index = this.grid.regions[i].cellIndex( c ) ;
                if( this.seq.sequences[i].getProbability( index ) === 0 ){
                        this.seq.sequences[i].setProbability( index, 1 );
                    }else{
                        this.seq.sequences[i].setProbability( index, 0 );
                    }
                    var probs = this.seq.sequences[i].getProbabilities();
                    const muteindex = i;
                    messages.push({channel: 'setVoice', data: muteindex});
                    messages.push({channel: 'prob', data: [...probs]});
                    
                    this.clear();// 

                    return messages;
                }
            }
        }
        if(this.mode === 4){ // remove mode
            var c = this.padsDown[0];
            var messages = [];
            /*
            var theRegion = this.grid.containsCell( c );
            var regionIndex = 0;
            if( theRegion !== undefinded ){
                this.grid.removeRegion( theRegion );
            }
            messages.push({channel: 'setVoice', data: regionIndex});
            messages.push({channel: 'what', data: 'what'});

            this.clear();
            return messages;
            */
        }
    }

    modifyRegionSequence(index, vector){
        /// do the work
    }

    sync(voiceNumber, sequenceIndex){ 
        var messages = [];
        var r = this.grid.regions[voiceNumber];

        // TODO sometimes this next line fails. 
        if( voiceNumber >= this.seq.sequences.length ){
            console.log('sequence array out of bounds');
            return messages;
        }
        
        this.seq.sequences[voiceNumber].setStep( sequenceIndex );

        if( sequenceIndex === 0 ){
            if( r.shouldCompute ){
                r.compute();
                console.log('region should compute');
            }
        }

        var currentNote = CellToPushNote( r.cells[sequenceIndex].x, r.cells[sequenceIndex].y, 'white');
        var previousStep = this.seq.sequences[voiceNumber].getPreviousStep();
        var previousNote = CellToPushNote( r.cells[ previousStep ].x,  r.cells[ previousStep ].y, colours[voiceNumber] );

        messages.push({ channel: 'midi-output', data: [144, currentNote[0], currentNote[1] ]});
        messages.push({ channel: 'midi-output', data: [144, previousNote[0], previousNote[1] ]});

        return messages;
    }

    syncControlSurface(voiceNumber, sequenceIndex){ 
        var messages = [];
        var r = this.grid.regions[voiceNumber];
        
        // TODO sometimes calling setStep fails
        if( voiceNumber >= this.seq.sequences.length ){
            console.log('sequence array out of bounds');
            return messages;
        }
        
        this.seq.sequences[voiceNumber].setStep( sequenceIndex );

        if( sequenceIndex === 0 ){
            if( r.shouldCompute ){
                r.compute();
                console.log('region should compute');
            }
        }

        var previousStep = this.seq.sequences[voiceNumber].getPreviousStep();
        console.log("previous step is: " +  previousStep );
        console.log("current step is: " +  sequenceIndex );

        messages.push({ channel: 'control-surface', data: [ r.cells[previousStep].x,  r.cells[previousStep].y, colourNumbers[voiceNumber]] });
        messages.push({ channel: 'control-surface', data: [ r.cells[sequenceIndex].x,  r.cells[sequenceIndex].y, 1] });
        return messages;
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

// Ableton Push 1,2,3 colour mapping
function CellToPushNote(x, y, colour){
	var note = y*8 + x + 36; 
	var outputcolour = 3;
	switch(colour){
		case 'white':
			outputcolour = 3;
			break;
		case 'red': 
			outputcolour = 127;
			break;
		case 'orange':
			outputcolour = 3;
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

module.exports = Mediator;
