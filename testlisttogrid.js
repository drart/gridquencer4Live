

// live.grid notation is column, row, not row,column
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