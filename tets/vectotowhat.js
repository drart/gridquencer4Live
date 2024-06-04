



function list(){
	var a = arrayfromargs(arguments);
	var sum = 0;
	var myarray = []
	for(var i = 0; i < a.length; i++){
		sum += a[i];
	}
	
	var beatLength = 1 / a.length;
	
	for(var i = 0; i < a.length; i++){
		for(var j = 0; j < a[i]; j++){
			myarray.push( i*beatLength + (beatLength / a[i])*j );
		}
	}
	
	
	outlet(0, myarray);
}