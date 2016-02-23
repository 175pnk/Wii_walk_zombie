#pragma strict

var spd:float = 0.01;
var rotate_spd:float = 0.01;
static var whichRemote: int;
static var triger_1: int;
static var triger_2: int;

function Start () {

}

function Update () {

	var theBalanceBoard = Wii.GetBalanceBoard(whichRemote); 

	if(theBalanceBoard.x >= 10 && theBalanceBoard.y >= 10) {
		transform.position.z += spd;
	}
	else if (theBalanceBoard.x >= 10 && theBalanceBoard.z >= 10) {
		transform.position.x += spd;
	}
	else if (theBalanceBoard.y >= 10 && theBalanceBoard.w >= 10) {
		transform.position.x -= spd;
	}
}