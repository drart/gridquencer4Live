exports.Grid = function(){

	this.rows = 8;
	this.columns = 8; // remove this? Do i need to check bounds?
	this.cells = []; // remove this? 
	this.regions = [];
	this.selectedCell = null;
	this.selectedRegion = null;
	this.allowOverlap = false;

}

exports.Grid.prototype.addRegion = function(region){
	if(this.allowOverlap){
		this.regions.push(region);
		return true;
	}else{
		var doesOverlap = this.doesRegionOverlap( region );
		post( "region overlapping: " + doesOverlap );

		if( doesOverlap ){
			var overlappingRegions = this.getOverlappingRegions(region);
			if(overlappingRegions.length === 1){
				if(region.leftSideAligned(overlappingRegions[0])){
					region.modify(overlappingRegions[0]);
					return true; 
				}
			}
			return false;
		}else{
			this.regions.push(region);
			for(var i = 0; i < region.cells.length; i++){
				this.cells.push( region.cells[i] );
			}
			return true;
		}
	}
};

exports.Grid.prototype.selectRegion = function(region){
	this.selectedRegion = region;
};

exports.Grid.prototype.selectCell = function( cell ){
	this.selectedCell = cell;
};

exports.Grid.prototype.containsCell = function(cell){
	for(var i = 0; i < this.regions.length; i++){
		if(this.regions[i].containsCell(cell)){
			return true;
		}
	}
	return false;
};

exports.Grid.prototype.doesRegionOverlap = function(region){

	/// testing filter form
	var ovrlr = this.regions.filter(function(r){
		r.doesOverlap(region);
	});
	post("number of overlapping regions "+ ovrlr.length + "\n");
	if(ovrlr.length === 0){
		///post("jjjjj\n");
		return false;
	}
	post("adflkadjfjf\n");
	return true;


	// for ( var i = 0; i < this.regions[i].length; i++){
	// 	if(this.regions[i].doesOverlap(region) ){
	// 		return true;
	// 	}
	// }
	// return false;
};

exports.Grid.prototype.getOverlappingRegions = function(region){
	return this.regions.filter(function(r){
		r.doesOverlap(region)
	});
}

exports.Grid.prototype.removeRegion = function(region){
	// find region
	// remove from this.regions
	// remove cells from this.cells
	// if region is selected set selected to null?

	/*
	region.steps.forEach(function(cell){
		this.thegrid[cell.y*8 + cell.x] = undefined;	
	}, this);
	

	var regionIndex = this.regions.findIndex( function( region ){
		return JSON.stringify( this.regions[i] ) == JSON.stringify( region );
	});

	log("find region index via array.findIndex: " +  regionIndex );

	var regionLocation; 
	for( var i = 0; i < this.regions.length; i++){
		if( JSON.stringify( this.regions[i] ) == JSON.stringify( region ) ){
			regionLocation = i;
			break;
		}	
	}

	if( regionLocation !== -1){
		this.regions.splice( regionLocation, 1 );
	}
	*/
};

exports.Grid.prototype.moveRegion = function(region, newOrigin){
// make a new region with dx and dy, test it for overlaps, then apply change 
};

exports.Grid.prototype.testTwoObjects = function( object1, object2 ){

	// this would be better
	//return( Object.keys(object1).every(function(key){ return object1[key] === object2[key]; });
	//return Object.keys(object1).every((key) =>  object1[key] === object2[key]);

	// works
	return JSON.stringify(object1) === JSON.stringify(object2);
}

//exports.Grid.prototype.toString = function(){ return "grid"; );
