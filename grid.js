
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

		// todo check to see that it doesn't overlap with more than one region? 

		if( doesOverlap ){
			// rename to overlapping cell? 
			var overlappingRegion = this.thegrid[ region.steps[0].y*8 + region.steps[0].x ]; 
	
			if( overlappingRegion !== undefined ){
				if( overlappingRegion.region.onBeat( region.steps[0] ) ){
					//overlappingRegion.region.steps.forEach(function(cell){
							//log(cell);
					//});

					//log('number of cells before: ' + overlappingRegion.region.steps.length );
					overlappingRegion.region.mergeRegion( region );
					region = overlappingRegion.region;

					//log('number of cells after: ' + overlappingRegion.region.steps.length );
					//log('number of steps in region: ' + region.steps.length );

				}else{
					return undefined;
				}
			}		
		}else{
			this.regions.push(region);
		}
	}

	/*
	var grid = this.thegrid;

	region.steps.forEach( function(cell){
		grid[ (cell.y*8) + cell.x] = { 
			region: region,
			cell: cell
		};
	});
	*/

	this.rebuildGrid();

	return region;
};


/*
exports.Grid.prototype.mergeRegion = function(region, newRegion){

	/// if new region has more cells then add to grid
	/// if new region has less cells then figure out the difference and remove those cells from the grid? 

};
*/


exports.Grid.prototype.rebuildGrid = function(){
	var grid = this.thegrid;
	//log("regions: " + this.regions.length );

	this.regions.forEach( function(region){
		region.steps.forEach( function(cell){
			//log( cell );
			grid[cell.y*8 + cell.x] = {
				region: region,
				cell: cell
			}
		});
	});


	var unemptycells = 0;
	this.thegrid.forEach(function(cell){
		if( cell ){unemptycells++}	
	});
	post("unempty cells in grid: " + unemptycells );
	
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


exports.Grid.prototype.overlappingRegions = function( region ){
	var overlappingRegions = [];
	
	// if found a region check to see it doesn't already exist in the array

	return overlappingRegions;
};


exports.Grid.prototype.removeRegion = function(region){};


//exports.Grid.prototype.toString = function(){ return "grid"; );
//exports.Grid.prototype.equals = function(){};
