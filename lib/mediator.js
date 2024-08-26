const Region = require('./region.js');
const Sequence = require('./sequence.js');

class Mediator {
	constructor( g , s){
		this.mode = 0; // input, select, shift, mute, move regions
		this.padsDown = [];
		this.grid = g; // reference to the main grid
        this.seq = s; // 
	}
	
	input( c ){ // c is often called with undefined
		//console.log( "sync input is: " + c );

        var messages = [];

		if(this.mode === 0){ // entry mode - default
			if(this.padsDown.length === 2 || this.padsDown.length === 1){
				console.log('new region with 1 or two touches');

				var r = new Region(this.padsDown); 

                // todo checkregion

				var resultingRegion = this.grid.addRegion(r);
				if(resultingRegion === undefined){
					console.log('region add failed');
					return;/// if region overlaps with another in a non-modifiable way then return
				}
				console.log('region added ' + resultingRegion.cells.length + ' cells long');
				var regionVector = resultingRegion.toVector();
				var regionIndex = this.grid.getRegionIndex(resultingRegion);

				//Max.outlet( 'setVoice', regionIndex );
                messages.push({channel: 'setVoice', data: regionIndex});
				//Max.outlet( 'createSequence', ...regionVector );
				messages.push({channel: 'createSequence', data: [...regionVector ]});

				this.seq.sequences[regionIndex] = new Sequence();
				this.seq.sequences[regionIndex].setVector( regionVector );
				//console.log( sequences[regionIndex] );
				var whatindices = this.seq.sequences[regionIndex].getMatches();
				

                messages.push({ channel: 'what', data: [...whatindices ]});
                // Max.outlet( 'what', ...whatindices );
				
				this.clear();
				
				//return [resultingRegion.toVectorWithOrigin(), regionIndex];
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


module.exports = Mediator;
