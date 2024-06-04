//


// 
var abletonPushMapping = {
    name : "Ableton Push",
    noteToCell: function CellToPushNote(x, y, colour){
        var note = y*8 + x + 36; 
        var outputcolour = 3;
        if(colour === 'blue'){
            outputcolour = 45;
        }
        //outlet(1, note, outputcolour);
        return midinote;
    }
};

var abletonPush3Mapping = {};
var p5jsMapping = {};
var novationLaunchPadMapping = {};

function midiOutput(msg, mappingName){
    switch( mappingName ){
        case abletonPushMapping.name :
            return abletonPushMapping.noteToCell(msg.note, msg.velo);
        case abletonPush3Mapping.name :
            break;
        case p5jsMapping.name : 
            break;
        default: 
            break;
    }
}







/*
//https://forum.ableton.com/viewtopic.php?t=192920
BLACK = 0

WHITE_HI = 3
WHITE_LO = 1

RED_HI = 120
RED_LO = 7

ORANGE_HI = 60
ORANGE_LO = 10

YELLOW_HI = 13
YELLOW_LO = 15

GREEN_HI = 21
GREEN_LO = 23

CYAN_HI = 33
CYAN_LO = 35

BLUE_HI = 45
BLUE_LO = 47

INDIGO_HI = 49
INDIGO_LO = 51

VIOLET_HI = 53
VIOLET_LO = 55
*/

