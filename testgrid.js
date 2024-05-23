// inlet takees list of x,y positions and sync x, y 
inlets = 1;
// outlet 1 gives the vector representation of a region
// outlet 2 origin of the region // todo 
// outlet 3 index of the region
// outlet 4 cells to output manager
outlets = 5;

var Cell = require("cell").Cell;
var Region = require("region").Region;
var Grid = require("grid").Grid; 
var Sequence = require("sequence").Sequence;

var thegrid = new Grid();

var sync = new SyncManager();
var output = new OutputManager();

var padsDown = [];
var sequences = [];

var colours = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'indigo', 'violet'];


function list(){ // TODO x,y,z?
	var a = arrayfromargs(arguments);
	var c = new Cell(a[0], a[1]);
	
	sync.input(c);
}

function syncstep(val){ // voiceNumber, index
	var a = arrayfromargs(arguments);
	
	var voiceIndex = a[0];
	var r = thegrid.regions[voiceIndex];
	var sequenceIndex = a[1]; 
	var previousIndex = sequenceIndex - 1;
	if (previousIndex === -1){
		previousIndex = r.cells.length - 1;
	}

    // var s = sequencer.sequences[voiceIndex];
		
	// current step highlight colour
    outlet(3, r.cells[sequenceIndex].x, r.cells[sequenceIndex].y, "white");
	// previous step sequence colour
	outlet(3, r.cells[previousIndex].x, r.cells[previousIndex].y, colours[voiceIndex]); // s.colour
	//outlet(3, r.cells[previousIndex].x, r.cells[previousIndex].y, "blue"); // s.colour
	//outlet(3, r.cells[previousIndex].x, r.cells[previousIndex].y, s.colour); // 
}

function getCells(){
	// print grid cells out right outlet for live.grid?
}

function reset(){
    // TODO
    if(padsDown.length === 1){ 
		//sync.input();
    }
	padsDown = [];
}

// bad idea?
function empty(){
	thegrid.cells = [];
	thegrid.regions = [];
}

function mode(){
	var m = arrayfromargs(arguments);
	//this.mode = val;
	//sync.changeMode(m[0]);
	
	sync.changeMode(m[0]);
	post(sync.mode);
}


function delete(index){
	// empty padsdown
	// empty sequences
	// clear grid
	// send clearing messages to sequencer
}

function SyncManager (){
	this.mode = 0; // input, select, shift, mute, move regions
	this.padsDown = [];
};

SyncManager.prototype.input = function(c){ // c is a Cell object
	if(this.mode === 0){ // entry mode - default
		
		if( c !== undefined ){
			padsDown.push(c);
		}
		
//        if(padsDown.length === 1){ // TODO distinct or wrap into next block?
//			c = padsDown[0]; // ?????
//       }
        
        if(padsDown.length === 2 || padsDown.length === 1){
		var r = new Region(padsDown); 
		post('lkjadlkfja');

            var resultingRegion = thegrid.addRegion(r);
            if(resultingRegion === undefined){
                return;/// if region overlaps with another in a non-modifiable way then return
            }
            var regionVector = resultingRegion.toVector();
            var regionIndex = thegrid.getRegionIndex(resultingRegion);

			/// MODE MANAGER TODO BETTER NAMING
            output.something(resultingRegion.toVectorWithOrigin(), regionIndex);

            outlet(2, regionIndex);
            outlet(1, regionVector); 

            //var message = [regionIndex];
            //message.unshift('voice');
            //outlet(0, message);
            //message = [regionVector];
            //message.unshift('shape');
            //message = [sequencer.sequences[regionIndex].getMatches()];
            //message.unshift('matches');

            ///// TODO put in other object
            ///////// vectoToMatches from sequence.js
            // var sum = 0;
            var myarray = [];
            var beatLength = 1 / regionVector.length;
	
            for(var i = 0; i < regionVector.length; i++){
                for(var j = 0; j < regionVector[i]; j++){
                    myarray.push( i*beatLength + (beatLength / regionVector[i])*j );
                }
            }
            sequences[regionIndex] = myarray;
            outlet(0, myarray);
            //// end vectorToMatches
            //////// 

            reset();
        }	
        //return;    
	}
	if(this.mode === 2){ // select mode
        for(var i = 0; i < thegrid.regions.length; i++){
            if(thegrid.regions[i].contains(c)){
                post(i); /// TODO SELECT THE REGION OR SELECT THE CELL?
            }
        }
	}
	if(this.mode === 1){ // shift mode
		post('got some input');
		post(c);
		post(thegrid.regions.length);
		post('\n');
		for(var i = 0; i < thegrid.regions.length; i++){
			if(thegrid.regions[i].containsCell(c)){
				post('cell is found');
                /*
				if(thegrid.regions[i].cellIndex !== undefined ){
					post('lkjlkjdf');
				}
                */
				var shift = thegrid.regions[i].cellIndex(c);
			    sequences[i].shift = shift; 
                //post( sequences[i].shift );

                // this is the desired functionality
                //var myarray = sequences[i].vectorToMatchesWithShift();
                //post(myarray);

                var vector = thegrid.regions[i].toVector();

                /////// taken from sequence.js
                var sum = 0;
                var myarray = []
                var ratios = [];
                for(var i = 0; i < vector.length; i++){
                    sum += vector[i];
                    for(var j = 0; j < vector[i]; j++){
                        ratios.push( 1 / (vector[i] * vector.length) );
                    }
                }

                /// todo do I need to compute shift in this way here?
                var beatLength = 1 / vector.length;
                var position = 0;
                for(var i = 0; i < ratios.length; i++){
                    var index = (i + shift) % ratios.length;
                    myarray.push( position );
                    position += ratios[index];
                }
                //////////////// end clip of sequence.js
                post(myarray);

                outlet(0, myarray)
				return;
			}
		}
	}
};

SyncManager.prototype.changeMode = function(m){
	this.mode = m; /// 0 sequence/create mode 1 shift mode 2 select mode
};

function OutputManager(){
	this.shapes = []; // this is a cached version of the region shapes
    //this.sequences = [];
};

OutputManager.prototype.something = function(vectorWithOrigin, index){
    var r = thegrid.regions[index];

	if(this.shapes[index] === undefined){ // add region
        for(var i = 0 ; i < r.cells.length; i++){
            //var celllist = [r.cells[i].x, r.cells[i].y, "blue"];
            var celllist = [r.cells[i].x, r.cells[i].y,  colours[index] ];
            //var s = new Sequence();
            outlet(3, celllist);
        }
	}else{ // modify the region
        var c = new Cell(vectorWithOrigin[0], vectorWithOrigin[1]);
        for(var i = 2; i < vectorWithOrigin.length; i++){

            if(vectorWithOrigin[i] !== this.shapes[index][i]){
                if(vectorWithOrigin[i] > this.shapes[index][i]){
                    for(var j = this.shapes[index][i]; j < vectorWithOrigin[i]; j++){
                        var x = vectorWithOrigin[0] + j;
                        var y = vectorWithOrigin[1] + i - 2;
                        var celllist = [x, y, colours[index]];
                        outlet(3, celllist);
                    }
                }else{
                    for(var j = vectorWithOrigin[i]; j < this.shapes[index][i]; j++){
                        var x = vectorWithOrigin[0] + j;
                        var y = vectorWithOrigin[1] + i - 2;
                        var celllist = [x, y, "grey"];
                        outlet(3, celllist);
                    }
                }
            }
        }
	}

	this.shapes[index] = vectorWithOrigin;
};


OutputManager.prototype.sync = function(c){
};

function RegionSequenceMediator(){
};
