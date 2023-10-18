inlets = 1;
outlets = 2;

var Cell = require("cell").Cell;
var Region = require("region").Region;
var Grid = require("grid").Grid; 

var padsDown = [];
var ccc = new Cell(3,3);
post(ccc.x);
var thegrid = new Grid();

function list(){
	var a = arrayfromargs(arguments);

	post(a[0]);
	var c = new Cell(a[0], a[1]);
	post(c.y);
	padsDown.push(c);
	//post(c);
	
	if(padsDown.length === 2){
		var r = new Region(padsDown[0], padsDown[1]);
		//post( padsDown[0].x + "\n" );
		//post(r.cells.length + "\n");
		thegrid.addRegion(r);
		
		var regionVector = r.toVector();
		//post(regionVector);
		for(var i = 0 ; i < r.cells.length; i++){
			var celllist = [r.cells[i].x, r.cells[i].y, 1];
			outlet(1, celllist);
		}
		//outlet(1, r.toVectorWithOrigin() );
		outlet(0, regionVector);
		reset();
	}
}

function getCells(){
	// print grid cells out right outlet for live.grid?
}

function reset(){
	padsDown = [];
}

// bad idea?
function empty(){
	thegrid.cells = [];
	thegrid.regions = [];
}
