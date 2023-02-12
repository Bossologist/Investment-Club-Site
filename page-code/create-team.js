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
	$w('#nameInput').value = "akdfsjlsakdjf";
});

export async function createTeam(event) {
	$w('#createTeamButton').disable();
	$w('#createTeamButton').label = "Loading...";

	//get data about user+contest
	let id = local.getItem("id");
	let contest = session.getItem("contest");

	//get inputs
	let name = $w("#nameInput").value;
	let hash;
	if (!$w("#passwordInput").hidden) {
		let pwd = $w("#passwordInput").value;
		let confirmPwd = $w("#confirmPassInput").value;
		hash = hashCode(pwd);

		$w("#passwordInput").onCustomValidation( (value, reject) => {if(pwd.length < 8) reject("Password must be at least 8 characters");});
		$w("#passwordInput").onCustomValidation( (value, reject) => {if(pwd != confirmPwd) reject("Passwords do not match");}, false);
		$w("#confirmPassInput").onCustomValidation( (value, reject) => {if(pwd != confirmPwd) reject("Passwords do not match");}, false);

		$w("#passwordInput").updateValidityIndication();
		$w("#confirmPassInput").updateValidityIndication();
	} else hash = -1;

	if ($w("#passwordInput").valid) {
		//create team
		let data = { "pwd": hash };
		console.log(id, contest);
		await addTeam(contest, name, id, data);

		wixLocation.to('/contests');
	} else {
		$w('#passwordInput').value = "";
		$w('#confirmPassInput').value = "";
		$w('#passInfoText').text = "* " + $w('#passwordInput').validationMessage;
		$w('#passInfoText').show();
	}

	$w('#createTeamButton').enable();
	$w('#createTeamButton').label = "Create Team";
}

export function publicSwitch_change(event) {
	if (!$w("#publicSwitch").checked) {
		$w("#passwordInput").hide();
		$w("#confirmPassInput").hide();
		$w("#passwordInput").required = false;
		$w("#confirmPassInput").required = false;
	} else {
		$w("#passwordInput").show();
		$w("#confirmPassInput").show();
		$w("#passwordInput").required = true;
		$w("#confirmPassInput").required = true;
	}
}
