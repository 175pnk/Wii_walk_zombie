#pragma strict

function Start () {
	Invoke("OnTriggerEnter", 5);
}

function OnTriggerEnter () {
		Application.LoadLevel("Stage");
}