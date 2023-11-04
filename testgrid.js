// inlet takees list of x,y position
inlets = 1;
// outlet 1 gives the vector representation of a region
// outlet 2 origin of the region // todo 
// outlet 3 index of the region
outlets = 4;

var Cell = require("cell").Cell;
var Region = require("region").Region;
var Grid = require("grid").Grid; 

var padsDown = [];
var ccc = new Cell(3,3);
post(ccc.x + "\n");
var thegrid = new Grid();

function list(){
	var a = arrayfromargs(arguments);

	var c = new Cell(a[0], a[1]);
	padsDown.push(c);
	
	if(padsDown.length === 2){
		var r = new Region(padsDown[0], padsDown[1]);
		var resultingRegion = thegrid.addRegion(r);
		var regionVector = resultingRegion.toVector();
    
		outlet(3,  [resultingRegion.bottomLeft.x, resultingRegion.bottomLeft.y] );

		outlet(2, thegrid.getRegionIndex(resultingRegion));

		/*
		for(var i = 0 ; i < r.cells.length; i++){
			var celllist = [r.cells[i].x, r.cells[i].y, 1];
			outlet(1, celllist);
		}
		*/
		outlet(1,  [resultingRegion.bottomLeft.x, resultingRegion.bottomLeft.y] );

		outlet(0, regionVector);
		//outlet(2, resultingRegion.toVectorWithOrigin() ); // works well
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
