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

export function subPassBut_click(event) {
	let inputPass = $w("#passInput").value;
	let inputHash = hashCode(inputPass);

	console.log(inputHash);
	if (pass == inputHash) {
		addUserToTeam(contest, id, teamId);
	}
	//do smth if password is wrong

	wixLocation.to('/contest');
}
