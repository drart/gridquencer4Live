outlets = 2;

var Cell = require("cell");
var Region = require("region");

var padsDown = [];



function list(){
	var a = arrayfromargs(arguments);
	var c = new Cell.Cell(a[0], a[1]);
	padsDown.push(c);
	//post(c);
	
	if(padsDown.length == 2){
		var r = new Region.Region(padsDown[0], padsDown[1]);
		//post( padsDown[0].x + "\n" );
		//post(r.cells.length + "\n");
		var regionVector = r.toVector();
		//post(regionVector);
		for(var i = 0 ; i < r.cells.length; i++){
			var celllist = [r.cells[i].x, r.cells[i].y];
			outlet(1, celllist);
		}
		//outlet(1, r.toVectorWithOrigin() );
		outlet(0, regionVector);
		reset();
	}
}

function reset(){
	padsDown = [];
	//post(padsDown.length + "\n");
}