import wixWindow from 'wix-window';
import { addUserToTeam } from 'backend/firebase.jsw';
import wixLocation from 'wix-location';

let pass;
let teamId;
let id;
let contest = "";

function hashCode(str) {
	if (str == "") return "";
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

$w.onReady(function () {
	let recieved = wixWindow.lightbox.getContext();
	pass = recieved.pwd;
	teamId = recieved.teamId;
	id = recieved.userId;
	contest = recieved.contest;
});

export async function subPassBut_click(event) {
	$w('#subPassBut').disable();
	$w('#subPassBut').label = "Loading...";

	let inputPass = $w("#passInput").value;
	let inputHash = hashCode(inputPass);

	if (pass == inputHash) {
		await addUserToTeam(contest, id, teamId);
		wixWindow.lightbox.close( {"joined": true} );
	}
	else {
		$w('#incorrectPassText').show();
		$w('#passInput').value = "";
	}

	$w('#subPassBut').enable();
	$w('#subPassBut').label = "Join";
}
