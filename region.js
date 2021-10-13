exports.Region = function(){
	this.beats = undefined;
	this.startPoint = undefined;
	this.endPoint = undefined;
	this.rows = [];
	this.steps = [];	

	this.bottomLeft = undefined;
	this.bottomRight = undefined;
	this.topLeft = undefined;
	this.topRight = undefined; 
};

// createFromCells
// checkOverlap
// equals
// getRow

// adjust row

exports.Region.prototype.addCells = function(cells){
	// must be either a cell or an array of cells. check it? 
	if (cells.length === 0 ){return;}

	if( cells.length === 1){
		this.startpoint = cells[0];
		this.endpoint = cells[0];
		this.beats = 1;
		this.steps = cells;
		return;
	}

	if (cells.length === 2){
		log('2 down parsing');
		this.startPoint = cells[0];
		this.endPoint = cells[1];

		log("startpoint: " + this.startPoint.x + "," + this.startPoint.y );
		log("endpoint: " + this.endPoint.x + " " + this.endPoint.y);

		if( this.startPoint.x <= this.endPoint.x){
			if( this.startPoint.y <= this.endPoint.y ){
				this.bottomLeft = this.startPoint;
				this.topRight = this.endPoint;	
				this.topLeft = new Cell.Cell(this.startPoint.x, this.endPoint.y);
				this.bottomRight = new Cell.Cell(this.endPoint.x, this.startPoint.y);
			}else{
				this.topLeft = this.startPoint;
			}
		}else{
			log('yet to be implemented');
		}
		this.beats = 0;

		for(var i = this.bottomLeft.y; i <= this.topLeft.y; i++){
			this.rows[this.beats] = [];
			for(var j = this.bottomLeft.x; j <= this.bottomRight.x; j++){
				var newCell = new Cell.Cell(j,i);

				this.steps.push( newCell );
				this.rows[this.beats].push(newCell);

				log( newCell );
			}
			this.beats++;
		}

	}

	if( cells.legnth > 2 ){
		log(' bigger shapes not yet implemented' );
	}
};

exports.Region.prototype.getRow = function(rowNumber){
	if( rowNumber > this.beats){return undefined}

	var theRow = [];
	var startRow = this.steps[0].y;

	this.steps.forEach(function(cell){
		if( cell.y === (rowNumber + startRow ) ){
			therow.push( cell );
		}
	});

	return theRow;
};

exports.Region.prototype.toNotes = function(){
	var newnotes = {};
	newnotes.notes = [];


	log( this.rows.length );

	
	for ( var i = 0; i < this.rows.length; i++){
		for (var j = 0; j < this.rows[i].length; j++){
			log(this.rows[i].length);
			newnotes.notes.push({
				pitch: 60 + i + j, 
				start_time: (j / this.rows[i].length ) + i,
				duration: 0.5 / this.rows[i].length		
			});
		}
	}

	return newnotes;
}

exports.Region.prototype.reviseRow = function(beat, row){
	// get the row 
	// replace the row array with new row? 
	// if beat is a number
	// if row is an array? 
}

exports.Region.prototype.clearBeat = function(beat){
	// check beat is a number and within the range of beats
	// this.rows[beat] = [];	
}

