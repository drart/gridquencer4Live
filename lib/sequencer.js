

class Sequencer{
    constructor(){
        this.sequences = [];
    }

    add( s ) {
        this.sequences.push( s );
    }

    get( i ){
        return this.sequences[i];
    }
}


module.exports = Sequencer;
