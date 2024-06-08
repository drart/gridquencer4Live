const Note = require('./note.js');

class Sequence{
	constructor(){
		this.type = "Sequence";
		this.vector; /// takes the vector representation of the region
		this.origin; /// origin of the region
		this.matches; // array of floats representing matches for what~ max/msp object
		this.notes = [];  // array of objects representing each notes
		this.previousStep = 0; // useful if steps aren't sequential
		this.currentStep = 0;
		this.shift = 0;
	}


	vectorToMatches(vector){
		this.vector = vector;

		var sum = 0;
		var myarray = []
		for(var i = 0; i < vector.length; i++){
			sum += vector[i];
		}

		/// todo do I need to compute shift in this way here? 
		var beatLength = 1 / vector.length;
		for(var i = 0; i < vector.length; i++){
			for(var j = 0; j < vector[i]; j++){
				myarray.push( i*beatLength + (beatLength / vector[i])*j );
			}
		}
		// todo make api better rather than modifying internal state
		this.matches = myarray;

		return this.getMatches();
	}

	// this modifies the matches vector with the shift baked in
	vectorToMatchesWithShift(){
		//this.vector = vector;
		var vector = this.vector;

		var sum = 0;
		var myarray = []
		var ratios = [];
		for(var i = 0; i < vector.length; i++){
			sum += vector[i];
			for(var j = 0; j < vector[i]; j++){
				ratios.push( 1 / (vector[i] * vector.length) );
			}
		}

		/// todo do I need to compute shift in this way here? 
		var beatLength = 1 / vector.length;
		var position = 0;
		for(var i = 0; i < ratios.length; i++){
			var index = (i + this.shift) % ratios.length;
			myarray.push( position );
			position += ratios[index];
		}
		// todo make api better rather than modifying internal state
		//this.matches = myarray;

		return myarray;
	}


	vectorWithOriginToMatches (vectorWithOrigin){
		var orig = [vectorWithOrigin[0], vectorWithOrigin[1]];
		this.origin = orig;
		// TODO hacky
		vectorWithOrigin.shift();
		vectorWithOrigin.shift();
		this.vectorToMatches(vectorWithOrigin);
	}

	getMatches(){
		return this.matches;
	}


	getSfhitedPhaseStart (){
		return this.matches[this.shift];
	}

	setShift( s ){
		this.shift = s;
	}

	setStep( s ){
		this.previousStep = this.step;
		this.currentStep = s;
	}
	
	getStep(){
		return this.currentStep;
	}

	setVector(vector){
		this.vector = vector;

		var sum = 0;
		var myarray = []
		for(var i = 0; i < vector.length; i++){
			sum += vector[i];
		}

		/// todo do I need to compute shift in this way here? 
		var beatLength = 1 / vector.length;
		for(var i = 0; i < vector.length; i++){
			for(var j = 0; j < vector[i]; j++){
				myarray.push( i*beatLength + (beatLength / vector[i])*j );
				this.notes.push( new Note(60, 127, 1) );
			}
		}
		// todo make api better rather than modifying internal state
		this.matches = myarray;
	}

	getVector(){
		return this.vector;
	}

	setProbabilities( p ){
		for( var i = 0; i < this.notes.length; i++){
			this.notes[i].probability = p;
		}
	}

	getProbabilities(){
		var prob = [];
		for ( var i = 0; i < this.notes.length; i++){
			prob.push( this.notes[i].probability );
		}
		return prob;
	}
	getProbability( i ){
		return this.notes[i].probability;
	}
	setProbability( i, p ){
		this.notes[i].probability = p;
	}

}

module.exports = Sequence;
