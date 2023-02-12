import { addTeam } from 'backend/firebase.jsw';
import wixWindow from 'wix-window';
let contest = "";
let id;

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

$w.onReady(async function () {
	let recieved = wixWindow.lightbox.getContext();
	id = recieved.userId;
	contest = recieved.contest;
});

export async function createTeam(event) {
	let name = $w("#nameInput").value;
	let pwd = $w("#passwordInput").value;
	let hash = hashCode(pwd);

	let data = { "pwd": hash };
	console.log(id, name);
	await addTeam(contest, name, id, data);
}
