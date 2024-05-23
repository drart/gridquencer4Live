var Cell = require("cell").Cell;
// requires array of cells
function Region(  arrayOfCells ){
	this.type = "Region";
	this.beats = 0; // int
	this.cells = []; //Array of Cells


	if( arrayOfCells.length === 1 ){
		this.bottomLeft = new Cell( arrayOfCells[0].x, arrayOfCells[0].y );
		this.topRight = new Cell( arrayOfCells[0].x, arrayOfCells[0].y );
		this.bottomRight = new Cell( arrayOfCells[0].x, arrayOfCells[0].y );
		this.bottomRight = new Cell( arrayOfCells[0].x, arrayOfCells[0].y );

		this.beats = 1;

		this.cells.push( new Cell( arrayOfCells[0].x, arrayOfCells[0].y ));
	}

	if( arrayOfCells.length === 2 ) {
		var firstPoint = arrayOfCells[0];
		var secondPoint = arrayOfCells[1];	
		
		this.bottomLeft = new Cell(Math.min(firstPoint.x, secondPoint.x), Math.min(firstPoint.y, secondPoint.y));
		this.topRight = new Cell(Math.max(firstPoint.x, secondPoint.x), Math.max(firstPoint.y, secondPoint.y));
		this.topLeft = new Cell(Math.min(firstPoint.x, secondPoint.x), Math.max(firstPoint.y, secondPoint.y));
		this.bottomRight = new Cell(Math.max(firstPoint.x, secondPoint.x), Math.min(firstPoint.y, secondPoint.y));

		this.beats = 0;
		for(var i = this.bottomLeft.y; i <= this.topLeft.y; i++){
			for(var j = this.bottomLeft.x; j <= this.bottomRight.x; j++){
				var c = new Cell(j, i);
				this.cells.push(c);
			}
			this.beats++;
		} 
	}

	if (arrayOfCells.length > 2 ) {

	}
};

// requires region input
// keeps cells before new region, removes all cells in the same rows, appends remaining cells
Region.prototype.modify = function(r){
    if( this.leftSideAligned(r) ){
        var preRegionCells = []

        var newRegionRows = []; // get the y indices of all of the rows in new region
        newRegionRows[0] = r.cells[0].y;
        for(var i = 1; i < r.cells.length; i++){
            if ( r.cells[i-1].y != r.cells[i].y ){
                newRegionRows.push( r.cells[i].y );
            }
        }

        this.cells = this.cells.filter(function(c){ // remove all cells in the same row
            for(var i = 0; i < newRegionRows.length; i++){
                if( c.y === newRegionRows[i] ){
                    return false;
                }
            }
            return true; 
        });

        this.cells = this.cells.concat( r.cells );
        this.cells.sort( function(a, b){
            if( a.y < b.y){
                return -1; 
            }
            if( a.y > b.y){
                return 1;
            }
            return 0; 
        });
        var firstPoint = this.cells[0];
        var secondPoint = this.cells[this.cells.length-1];
        this.bottomLeft = new Cell(Math.min(firstPoint.x, secondPoint.x), Math.min(firstPoint.y, secondPoint.y));
        this.topRight = new Cell(Math.max(firstPoint.x, secondPoint.x), Math.max(firstPoint.y, secondPoint.y));
        this.topLeft = new Cell(Math.min(firstPoint.x, secondPoint.x), Math.max(firstPoint.y, secondPoint.y));
        this.bottomRight = new Cell(Math.max(firstPoint.x, secondPoint.x), Math.min(firstPoint.y, secondPoint.y));
        return true;
    }
    return false;
};

// returns vector representation of region
Region.prototype.toVector = function(){
	if(this.cells.length == 1){
		return [1];
	}

    var regionlist = [];

	var s = 1;
	for(var i = 1; i < this.cells.length; i++){
		if(this.cells[i-1].y != this.cells[i].y){
			regionlist.push(s);
			s = 1
		}else{
			s++;
		}

	}
	regionlist.push(s);
    return regionlist;
};

// returns vector representtion starting with origin, useful in maxmsp
Region.prototype.toVectorWithOrigin = function(){
	var origin = [this.bottomLeft.x, this.bottomLeft.y];
	var regionlist = this.toVector();
	var biglist = origin.concat(regionlist);
	return biglist;
};

// returns number of steps in region
Region.prototype.numberOfSteps = function(){
	return this.cells.length;
};

// requires cell input
Region.prototype.containsCell = function(c){
	for(var i = 0; i < this.cells.length; i++){
		if(c.x === this.cells[i].x && c.y === this.cells[i].y){
			return true;
		}
	}
	return false;
};

// requires cell input
Region.prototype.cellIndex = function(c){
    if ( !this.containsCell(c) ){
        return -1;
    }

    for(var i = 0; i < this.cells.length; i++){
		if(c.x === this.cells[i].x && c.y === this.cells[i].y){
			return i;
		}
    }
};

// regquires region input
Region.prototype.doesOverlap = function(r){
	for(var i = 0; i < r.cells.length; i++){
		if(this.containsCell(r.cells[i])){
			return true;
		}
	}
	return false;
};

// requires region input
Region.prototype.leftSideAligned = function(r){
	if(r.bottomLeft.x === this.bottomLeft.x){
		return true;
	}
	return false;
};

/////// legacy code, maybe useful?
Region.prototype.toNotes = function(){
	var newnotes = {};
	newnotes.notes = [];
	
	for (var i = 0; i < this.rows.length; i++){
		for (var j = 0; j < this.rows[i].length; j++){
			newnotes.notes.push({
				pitch: 60 + i + j, 
				start_time: (j / this.rows[i].length ) + i,
				duration: 0.5 / this.rows[i].length		
			});
		}
	}
	return newnotes;
};

Region.prototype.equals = function(r){
    return  r == this;
}
exports.Region = Region;
