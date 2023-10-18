
exports.Grid = function(){

    this.type = "Grid";
	this.regions = [];
	this.allowOverlap = false;

}

exports.Grid.prototype.addRegion = function(region){
	if(this.allowOverlap){
		this.regions.push(region);
		return true;
	}

    var doesOverlap = this.doesRegionOverlap( region );
    if( doesOverlap ){
        var overlappingRegions = this.getOverlappingRegions(region);
        if(overlappingRegions.length === 1){
            //console.log('lkajjflkjadljfkadjflkajdklfjd');
            if(region.leftSideAligned(overlappingRegions[0])){
                overlappingRegions[0].modify(region);
                return true; 
            }
        }
        return false;
    }else{
        this.regions.push(region);
        return true;
    }
};

exports.Grid.prototype.doesRegionOverlap = function(region){
	for ( var i = 0; i < this.regions.length; i++){
        if(this.regions[i].doesOverlap(region) ){
            return true;
        }
	}
	return false;
};

exports.Grid.prototype.getOverlappingRegions = function(region){
    var overlappingRegions = [];
    for(var i = 0; i < this.regions.length; i++){
        if( this.regions[i].doesOverlap( region ) ){
            overlappingRegions.push( this.regions[i] );
        }
    }
    return overlappingRegions;
}

exports.Grid.prototype.containsCell = function(cell){
	for(var i = 0; i < this.regions.length; i++){
		if(this.regions[i].containsCell(cell)){
			return true;
		}
	}
	return false;
};

exports.Grid.prototype.removeRegion = function(region){
	// find region
	// remove from this.regions
	/*
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
