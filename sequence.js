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
	
	var beatLength = 1 / vector.length;
	
	for(var i = 0; i < vector.length; i++){
		for(var j = 0; j < vector[i]; j++){
			myarray.push( i*beatLength + (beatLength / vector[i])*j );
		}
	}
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

Sequence.protoptype.getMatches = function(){
    if( this.shift === 0 ){
        return this.matches;
    }else{
        var shiftedarray = [];
        for(var i = 0; i < this.matches.length; i++){
            shiftedarray[i] = this.matches[ (i+this.shift) % this.matches.length];
        }
        return shiftedarray;
    }
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
