

// live.grid notation is column, row, not row,column
// takes in a list and creates cells for live.grid

function list(){
	var a = arrayfromargs(arguments);
	
	for(var i = 0; i < a.length; i++){
		//post(a[i]);
		for(var j = 0; j < a[i]; j++){
			//post(a[i]);
			var output = [1, 1, 1];
			output[0] = j + 1;
			output[1] = i + 1; 
			outlet(0, output);
		}
	}
}

/* with origin? 
function list(){
	var a = arrayfromargs(arguments);
	var originx = a[0];
	var originy = a[1];
	
	for(var i = 2; i < a.length; i++){
		//post(a[i]);
		for(var j = 2; j < a[i]; j++){
			//post(a[i]);
			var output = [1, 1, 1];
			output[0] = j + originy;
			output[1] = i + originx; 
			outlet(0, output);
		}
	}
}
*/