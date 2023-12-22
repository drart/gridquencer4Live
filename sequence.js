function Sequence(){
    this.type = "Sequence";
    this.vector; /// takes the vector representation of the region
    this.origin; /// origin of the region
    this.matches; // array of floats representing matches for what~ max/msp object
    this.notes = [];  // array of objects representing each notes
    this.previousStep = 0; // useful if steps aren't sequential
    this.currentStep = 0;
    this.shift = 0;
    this.colour = "blue";
};

Sequence.prototype.vectorToMatches = function(vector){
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
};

// this modifies the matches vector with the shift baked in
Sequence.prototype.vectorToMatchesWithShift = function(vector){
    this.vector = vector;

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
    this.matches = myarray;

    return this.getMatches();
};




Sequence.prototype.vectorWithOriginToMatches = function(vectorWithOrigin){
    var orig = [vectorWithOrigin[0], vectorWithOrigin[1]];
    this.origin = orig;
    // TODO hacky
    vectorWithOrigin.shift();
    vectorWithOrigin.shift();
    this.vectorToMatches(vectorWithOrigin);
}

Sequence.prototype.getMatches = function(){
        return this.matches;
};


Sequence.prototype.getSfhitedPhaseStart = function(){
    return this.matches[this.shift];
};


/*
var note = {
    pitch: 60,
    velocity: 100,
    probability: 1,
    mute: false
}
*/

exports.Sequence = Sequence;
