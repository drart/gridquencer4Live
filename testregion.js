var Cell = require("cell");
var Region = require("region");

var padsDown = [];

function list(){
	var a = arrayfromargs(arguments);
	var c = new Cell.Cell(a[0], a[1]);
	padsDown.push(c);
	//post(c);
	
	if(padsDown.length == 2){
		var r = new Region.Region();
		//post( padsDown[0].x + "\n" );
		r.build( padsDown[0], padsDown[1] );
		//post(r.cells.length + "\n");
		var regionVector = r.toVector();
		//post(regionVector);
		outlet(0, regionVector);
		reset();
	}
}

function reset(){
	padsDown = [];
	//post(padsDown.length + "\n");
}