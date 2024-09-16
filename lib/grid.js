
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

    tryAddRegion( region ){
        if(this.allowOverlap){
            this.regions.push(region);
            return this.regions[this.regions.length-1];
        }

        var doesOverlap = this.doesRegionOverlap( region );
        if( doesOverlap ){
            var overlappingRegions = this.getOverlappingRegions(region);
            if(overlappingRegions.length === 1){
                if(region.leftSideAligned(overlappingRegions[0])){
                    overlappingRegions[0].tryModify(region);
                    return overlappingRegions[0]; 
                }
            }
            return undefined;
        }else{
            this.regions.push(region);
            return this.regions[this.regions.length-1];;
        }
    }

    checkRegion( region ){
        var overlappingRegions = this.getOverlappingRegions( region );
        if( overlappingRegions.length > 1 ){
            return false;
        }
        if( overlappingRegions.length === 1 ){
            if( region.leftSideAligned( overlappingRegions[0] ) ){
                return true;
            }else{
                return false;
            }
        }
        if( overlappingRegions.length === 0 ){
            return true;
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
            if(this.regions[i].equals(region) ){ // TODO check this
                return i;
            }
        }
        return -1;
    }

	removeRegion (region){
		var regionLocation this.getRegionIndex( region ); 

		if( regionLocation !== -1){
			this.regions.splice( regionLocation, 1 );
		}
	};

	moveRegion (region, newOrigin){ // newOrigin is a cell representing the new bottom left (or origin of the cell)
	// make a new region with dx and dy, test it for overlaps, then apply change 
        for( cell of region.cells ){
            // copy cell
            // var newCell 
            // transpose with newOrigin
            // if(  this.containsCell( newCell ) === true ){return false}

        }
        return true;
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

//export { Grid };
module.exports = Grid;
