


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






/// cite this gem properly
function log() {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
      post(s);
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}
