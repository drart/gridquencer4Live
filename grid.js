
exports.Grid = function(){

	this.rows = 8;
	this.columns = 8;
	this.regions = [];
	this.thegrid = [];
	this.selectedCell = null;
	this.selectedRegion = null;
	this.allowOverlap = false;
	
	for (var i = 0; i < this.rows * this.columns; i++){
		this.thegrid[i] = undefined;
	}
}

exports.Grid.prototype.addRegion = function(region){
	if(this.allowOverlap){
		this.regions.push(region);
	}else{
		var doesOverlap = this.doesOverlap( region );
		log( "region overlapping: " + doesOverlap );

		if( doesOverlap ){
			return false;
		}
	
		this.regions.push(region);
	}

	var grid = this.thegrid;

	region.steps.forEach( function( cell){
		grid[ (cell.y*8) + cell.x] = { 
			region: region,
			cell: cell
		};
	});
};

exports.Grid.prototype.selectRegion = function(region){
	this.selectedRegion = region;
};


exports.Grid.prototype.selectCell = function( cell ){
	this.selectedCell = cell;
};

exports.Grid.prototype.doesOverlap = function(region){
	var grid = this.thegrid;

	for ( var i = 0; i < region.steps.length; i++){
		if( grid[ region.steps[i].y*8 + region.steps[i].x] !== undefined){
			return true;
		}
	}

	return false;
};

exports.Grid.prototype.removeRegion = function(region){};


//exports.Grid.prototype.toString = function(){ return "grid"; );
//exports.Grid.prototype.equals = function(){};
