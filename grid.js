
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
		// todo check overlap
		this.regions.push(region);
	}


	var that = this;

	region.steps.forEach( function( cell){
		that.thegrid[ cell.x*8 + cell.y] = region;
	});
};

exports.Grid.prototype.selectRegion = function(region){
	this.selectedRegion = region;
};

exports.Grid.prototype.equals = function(){};
exports.Grid.prototype.checkOverlap = function(){};
exports.Grid.prototype.removeRegion = function(region){};

