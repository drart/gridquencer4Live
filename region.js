exports.Region = function(){
	this.type = "Region";
	this.beats = 0; // int
	this.cells = []; //Array of Cells

	this.bottomLeft = undefined; // Cell
	this.bottomRight = undefined; // Cell
	this.topLeft = undefined; // Cell
	this.topRight = undefined; // Cell
};


// requires two cell inputs // maybe put in constructor?
exports.Region.prototype.build = function(firstPoint, secondPoint){

	this.bottomLeft = new Cell.Cell(Math.min(firstPoint.x, secondPoint.x), Math.min(firstPoint.y, secondPoint.y));
	this.topRight = new Cell.Cell(Math.max(firstPoint.x, secondPoint.x), Math.max(firstPoint.y, secondPoint.y));
	this.topLeft = new Cell.Cell(Math.min(firstPoint.x, secondPoint.x), Math.max(firstPoint.y, secondPoint.y));
	this.bottomRight = new Cell.Cell(Math.max(firstPoint.x, secondPoint.x), Math.min(firstPoint.y, secondPoint.y));
	//post(secondPoint.x + "\n");
	//post(this.topLeft.x + "\n");


	this.beats = 0;
	for(var i = this.bottomLeft.y; i <= this.topLeft.y; i++){
		for(var j = this.bottomLeft.x; j <= this.bottomRight.x; j++){
			var c = new Cell.Cell(j, i);
			this.cells.push(c);
		}
		this.beats++;
	} 
	//post(this.beats + "\n")

};

// TODO
// requires region input
exports.Region.prototype.modify = function(r){

};

// TODO 
// returns 
exports.Region.prototype.toVector = function(){
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

// returns number of steps in region
exports.Region.prototype.numberOfSteps = function(){
	return this.cells.length;
};

// requires cell input
exports.Region.prototype.containsCell = function(c){
	for(var i = 0; i < this.cells.length; i++){
		if(c.x == this.cells[i].x && c.y == this.cells[i].y){
			return true;
		}
	}
	return false;
};

// regquires region input
exports.Region.prototype.doesOverlap = function(r){
	for(var i = 0; i < r.cells.length; i++){
		if(this.containsCell(r.cells[i])){
			return true;
		}
	}
	return false;
};

// requires region input
exports.Region.prototype.leftSideAligned = function(r){
	if(r.bottomLeft.x == this.bottomLeft.x){
		return true;
	}
	return false;
};


/////// legacy code, maybe useful?
exports.Region.prototype.toNotes = function(){
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