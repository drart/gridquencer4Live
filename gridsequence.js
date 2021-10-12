exports.GridSequence = function(region){
	this.region = region;
	this.beats = undefined;
	this.clip = undefined;
}


exports.GridSequence.prototype.regionToSequence = function(region, note, vel){
	this.region = region;	
	this.beats = region.beats;	

	var clipSlot = new LiveAPI("live_set tracks 0 clip_slots 0");
	clipSlot.call("create_clip");
	var clip = new LiveAPI("live_set tracks 0 clip_slots 0 clip");


	for ( var b = 0; b < this.beats; b++){
		var row = this.region.getRow( b );
		var stepLength =  1 / row.length;

		for (var [i, cell] of row.entries() ){
			// add a note that is stepLength / 2

		}
	}
};






