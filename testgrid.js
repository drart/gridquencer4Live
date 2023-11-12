// inlet takees list of x,y positions and sync x, y 
inlets = 1;
// outlet 1 gives the vector representation of a region
// outlet 2 origin of the region // todo 
// outlet 3 index of the region
// outlet 4 cells to output manager
outlets = 4;

var Cell = require("cell").Cell;
var Region = require("region").Region;
var Grid = require("grid").Grid; 

var thegrid = new Grid();

var sync = new SyncManager();
var output = new OutputManager();

var s = {
	tempo: 100,
	sequences: [],
};
var padsDown = [];

function list(){ // TODO x,y,z?
	var a = arrayfromargs(arguments);
	var c = new Cell(a[0], a[1]);
	
	sync.input(c);
}


function sync(){
	var a = arrayfromargs(arguments);
	
	//sync.input(a);
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

function mode(){
	//this.mode = val;
}

function SyncManager (){
	
	this.mode = 0; // input, select, shift, mute
	this.padsDown = [];

};

SyncManager.prototype.input = function(c){
	if(this.mode === 0){ // entry mode - default
		
		padsDown.push(c);
        
        if(padsDown.length === 2){
            var r = new Region(padsDown[0], padsDown[1]);
            var resultingRegion = thegrid.addRegion(r);
            var regionVector = resultingRegion.toVector();
            var regionIndex = thegrid.getRegionIndex(resultingRegion);

            output.something(resultingRegion.toVectorWithOrigin(), regionIndex);
            // syncmanager -> outputmanager outlet 3

            outlet(2, regionIndex);
            outlet(1,  [resultingRegion.bottomLeft.x, resultingRegion.bottomLeft.y] ); // origin
            outlet(0, regionVector); // TODO vector or vectorwithorigin?
            reset();
        }	
            
	}
	if(this.mode === 1){ // select mode
        for(var i = 0; i < thegrid.regions.length; i++){
            if(thegrid.regions[i].contains(c)){
                post(i); /// TODO SELECT THE REGION OR SELECT THE CELL?
            }
        }
	}
	if(this.mode === 2){ // shift
		for(var i = 0; i < thegrid.regions.length; i++){
			if(thegrid.regions[i].contains(c)){
				var idx = thegrid.regions[i].cellIndex(c);
				s.sequences[i].shift = i;
				return;
			}
		}
	}
};


function OutputManager(){
	this.shapes = []; // this is a cached version of the region shapes
};

OutputManager.prototype.something = function(vectorWithOrigin, index){
    var r = thegrid.regions[index];
	if(this.shapes[index] === undefined){
		post("add region\n");
        for(var i = 0 ; i < r.cells.length; i++){
            var celllist = [r.cells[i].x, r.cells[i].y, 1];
            outlet(3, celllist);
        }
	}else{
		post("modify region\n");
		// modify the region
        var c = new Cell(vectorWithOrigin[0], vectorWithOrigin[1]);
        for(var i = 2; i < vectorWithOrigin.length; i++){
            if(vectorWithOrigin[i] !== this.shapes[index][i]){
                post(i + '\n');
                if(vectorWithOrigin[i] > this.shapes[index][i]){
                    post(" row bigger\n");
                    // TODO add more cells
                    // for number of cells to add
                    // var celllist = [r.cells[j].x, r.cells[j].y, 1];
                    // outlet(3, celllist);
                }else{
                    post(" row shorter\n");
                    // todo send note off to cells that are no longer needed
                    // for number of cells to remove
                    // var celllist = [r.cells[j].x, r.cells[j].y, 0];
                    // outlet(3, celllist);
                }
            }
        }
	}
	this.shapes[index] = vectorWithOrigin;
};


OutputManager.prototype.sync = function(c){
};

