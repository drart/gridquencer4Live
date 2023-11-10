

function pushNoteToCellPosition(note, velo){
	if(velo == 0 ){
		outlet(0, "reset");
		return;
	}
	
	var position = [1,1];
	position[0] = (note - 36) % 8 ;
	position[1] = Math.floor(( note - 36) / 8);
	// convert to 1,1 to 8,8 notation instead of 0,0 to 7,7
	//position[0]++;
	//position[1]++; 
	
	//return position;
	outlet(0, position);
}

