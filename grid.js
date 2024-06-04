
class Grid{

	constructor(){
		this.type = "Grid";
		this.regions = [];
		this.allowOverlap = false;
	}

	addRegion (region){
		if(this.allowOverlap){
			this.regions.push(region);
			return this.regions[this.regions.length-1];
		}

	    var doesOverlap = this.doesRegionOverlap( region );
	    if( doesOverlap ){
		var overlappingRegions = this.getOverlappingRegions(region);
		if(overlappingRegions.length === 1){
		    //console.log('lkajjflkjadljfkadjflkajdklfjd');
		    if(region.leftSideAligned(overlappingRegions[0])){
			overlappingRegions[0].modify(region);
			return overlappingRegions[0]; 
		    }
		}
		return undefined;
	    }else{
		this.regions.push(region);
		return this.regions[this.regions.length-1];;
	    }
	}

	doesRegionOverlap (region){
		for ( var i = 0; i < this.regions.length; i++){
		if(this.regions[i].doesOverlap(region) ){
		    return true;
		}
		}
		return false;
	}

	getOverlappingRegions (region){
	    var overlappingRegions = [];
	    for(var i = 0; i < this.regions.length; i++){
		if( this.regions[i].doesOverlap( region ) ){
		    overlappingRegions.push( this.regions[i] );
		}
	    }
	    return overlappingRegions;
	}

	containsCell (cell){
		for(var i = 0; i < this.regions.length; i++){
			if(this.regions[i].containsCell(cell)){
				return true;
			}
		}
		return false;
	};

	getRegionIndex (region){
	    for(var i = 0; i < this.regions.length; i++){
		if(this.regions[i].equals(region) ){
		    return i;
		}
	    }
	    return -1;
	}

	// TODO 
	removeRegion (region){
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

	moveRegion (region, newOrigin){
	// make a new region with dx and dy, test it for overlaps, then apply change 
	}

	testTwoObjects ( object1, object2 ){

		// this would be better
		//return( Object.keys(object1).every(function(key){ return object1[key] === object2[key]; });
		//return Object.keys(object1).every((key) =>  object1[key] === object2[key]);

		// works
		return JSON.stringify(object1) === JSON.stringify(object2);
	}


	//exports.Grid.prototype.toString = function(){ return "grid"; );

}

export { Grid };
