function detectMaxMSP() {
  try {
    /*
      For references to all functions attached to window.max object read the
      "Communicating with Max from within jweb" document from Max documentation.
    */
    window.max.outlet('Hello Max!');
    return true;
  }
  catch(e) {
    console.log('Max, where are you?');
  }
  return false;
}

const s = ( sketch ) => {
    const maxIsDetected = detectMaxMSP();

    let squares = [];
    sketch.setup = () =>{
        if( maxIsDetected){
            window.max.bindInlet('grid', sketch.colourSquare);
            window.max.bindInlet('clear', sketch.clearGrid);

            window.max.outlet('lkdf');
        }

        sketch.createCanvas(400,400);

        for( var y = 0; y < 8 ; y++){
            for( var x = 0; x < 8; x++){
                squares.push({
                    x : x*50,
                    y: 350- (y*50),
                    xindex : x,
                    yindex: y,
                    color: "grey",
                    draw: function(){
                        sketch.fill( this.color );
                        sketch.rect(this.x, this.y, 50, 50, 10, 10 , 10 , 10);
                    },
                    clicked: function(){
                        if( this.x < sketch.mouseX && sketch.mouseX < this.x + 50 && this.y < sketch.mouseY && sketch.mouseY < this.y + 50){

                            this.color = "white";
                            return true;
                        }
                        return false; 
                    }
                });
            }    
        }
    };

    sketch.draw = () => {
        sketch.background(50);
        for( let s of squares ){
            s.draw();
        }
    };

    sketch.clearGrid = () => {
        for( let s of squares ){
            s.color = "white";
        }
    };

    sketch.mouseClicked = () => {
        for ( sqr of squares ){
            if( sqr.clicked() ){
                if(maxIsDetected){
                    window.max.outlet(sqr.xindex, sqr.yindex);
                }
            }
        }
    };

    sketch.colourSquare = (x,y,colour) => {
        squares[x + y*8].color = colour;
    }

    /*
     if(keyIsPressed){
        if(keyCode === SHIFT){
        }
     }
     */
};

let myp5 = new p5(s)




