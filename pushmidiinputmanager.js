function pushNoteToCellPosition(note){
	var position = [1,1];
	position[0] = (note - 36) % 8 ;
	position[1] = Math.floor(( note - 36) / 8);
	// convert to 1,1 to 8,8 notation instead of 0,0 to 7,7
	position[0]++;
	position[1]++; 
	
	//return position;
	outlet(0, position);
}

function midiInput(){
	var a = arrayfromarguments();
	if(a[1] == 0){ // note off
		outlet(0, 'clear');
	}else{
		pushNoteToCellPosition(a[0]);
	}
}
