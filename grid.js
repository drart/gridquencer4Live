exports.Grid = function(){

	this.rows = 8;
	this.columns = 8;
	this.regions = [];
	this.thegrid = [];
	this.selectedCell = null;
	this.selectedRegion = null;
	this.allowOverlap = false;

	//for (var i = 0; i < this.rows * this.columns; i++){
	//		this.thegrid[i] = undefined;
	//}
}
/*
exports.Grid.prototype.printUnemptyCells = function(){

	var unemptycells = 0;
	this.thegrid.forEach(function(cell){
		if( cell ){unemptycells++}	
	});
	post("unempty cells in grid: " + unemptycells );

};
*/

exports.Grid.prototype.addRegion = function(region){
	// todo make sure it is within bounds?  //this.printUnemptyCells();

	if(this.allowOverlap){
		this.regions.push(region);
	}else{
		var doesOverlap = this.doesOverlap( region );
		log( "region overlapping: " + doesOverlap );

		// todo check to see that it doesn't overlap with more than one region? 
		// move this to the 

		if( doesOverlap ){
			// rename to overlapping cell? 
			var overlappingRegion = this.thegrid[ region.steps[0].y*8 + region.steps[0].x ]; 
	
			if( overlappingRegion !== undefined ){
				if( overlappingRegion.region.onBeat( region.steps[0] ) ){ // adjust a beat

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



	//var grid = this.thegrid;

       region.steps.forEach( function(cell){
               this.thegrid[ (cell.y*8) + cell.x] = { 
                       region: region,
                       cell: cell
               };
       }, this);

	return region;
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

exports.Grid.prototype.overlappingRegions = function( newRegion ){
	var overlappingRegions = [];
	
	// if found a region check to see it doesn't already exist in the array
	this.regions.forEach(function(region){
		region.rows.forEach(function(row){
			row.forEach(function(cell){
				// if overlap overlappingRegions.push(region)					
			});
		});
	});	

	return overlappingRegions;
};

exports.Grid.prototype.removeRegion = function(region){
	// remove all indices from the grid
	// remove region from this.regions 
};

exports.Grid.prototype.testTwoObjects = function( object1, object2 ){

	//return( Object.keys(object1).every(function(key){ return object1[key] === object2[key]; });
	//return Object.keys(object1).every((key) =>  object1[key] === object2[key]);

	return JSON.stringify(object1) === JSON.stringify(object2);
}

//exports.Grid.prototype.toString = function(){ return "grid"; );
