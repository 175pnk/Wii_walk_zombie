#pragma strict

function OnTriggerEnter (other : Collider) {

	if (other.name == "PlayerCamera") {
		Application.LoadLevel("Goal");
	}
}