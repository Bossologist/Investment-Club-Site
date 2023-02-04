import { addTeam } from 'backend/firebase.jsw';
import wixWindow from 'wix-window';
import { local, session } from 'wix-storage';
import wixLocation from 'wix-location';

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
});

export async function createTeam(event) {
	//get data about user+contest
	let id = local.getItem("id");
	let contest = session.getItem("contest");

	//get inputs
	let name = $w("#nameInput").value;
	let pwd = $w("#passwordInput").value;
	let confirmPwd = $w("#confirmPassInput").value;
	let hash = hashCode(pwd);

	$w("#passwordInput").onCustomValidation( (value, reject) => {if(pwd.length < 8) reject("Password must be at least 8 characters");});
	$w("#passwordInput").onCustomValidation( (value, reject) => {if(pwd != confirmPwd) reject("Passwords do not match");}, false);
	$w("#confirmPassInput").onCustomValidation( (value, reject) => {if(pwd != confirmPwd) reject("Passwords do not match");}, false);

	$w("#passwordInput").updateValidityIndication();
	$w("#confirmPassInput").updateValidityIndication();

	if ($w("#passwordInput").valid) {
		//create team
		let data = { "pwd": hash };
		console.log(id, contest);
		await addTeam(contest, name, id, data);

		wixLocation.to('/contests');
	}
}
