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

	var clip = new LiveAPI(function(args){

			// for all notes in the sequence determine if any are sounding 
			// for all sounding notes put lights on
			// for all non sounding notes turn lights off


			outlet(1, "setcell " + 2 + " " + 2 + " " + 1);	
		}, 
		"live_set tracks 0 clip_slots 0 clip"
	);
	clip.property = "playing_position";


	var theNotes = clip.get("get_notes_extended", 0, 128, 0, this.region.beats);



	this.clip = clip;
	

};


function updateMatrix(){

}

function updatePush2Grid(){

}

// remove gridsequence set id 0




/// get the ids of all notes

