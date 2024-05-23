/*
//https://forum.ableton.com/viewtopic.php?t=192920
BLACK = 0

WHITE_HI = 3
WHITE_LO = 1

RED_HI = 120
RED_LO = 7

ORANGE_HI = 60
ORANGE_LO = 10

YELLOW_HI = 13
YELLOW_LO = 15

GREEN_HI = 21
GREEN_LO = 23

CYAN_HI = 33
CYAN_LO = 35

BLUE_HI = 45
BLUE_LO = 47

INDIGO_HI = 49
INDIGO_LO = 51

VIOLET_HI = 53
VIOLET_LO = 55
*/

function pushNoteToCellPosition(note, velo){
	if(velo == 0 ){
		outlet(0, "noteOff");
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
