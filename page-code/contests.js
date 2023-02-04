import wixLocation from 'wix-location';
import { authentication, currentMember } from 'wix-members';
import { getTeamId } from 'backend/firebase.jsw';
import wixWindow from 'wix-window';
import { local, memory, session } from 'wix-storage';

const testSpring = "test-spring-2023";

$w.onReady(async function () {
	const isLoggedIn = authentication.loggedIn();
	if (isLoggedIn) {
		var curr = await currentMember.getMember();
		let id = curr._id;
		local.setItem("id", id);

		//check if in test spring contest
		let teamId = await getTeamId(id, "test-spring-2023");
		console.log(teamId);
		if (teamId != -1 && teamId !== null) $w("#joinContestButton").hide(), $w("#viewContestButton").enable();
		else $w("#viewContestButton").disable(), $w("#joinContestButton").show();
	} else {
		$w('#viewContestButton').disable();
		$w('#contestStatusText').html = 
			'<h1 style="color: red; font-size: 20px; font-style: Cormorant Garamond Semi Bold">Not Joined</h1>';
		console.log("logged out");
	}
});

export async function joinContest(event) {
	session.setItem("contest", testSpring);
	wixWindow.openLightbox("create-join-team");
}

export async function sendContest(event) {
	$w("#viewContestButton").label = "Loading...";
	$w("#viewContestButton").collapseIcon();
	$w("#viewContestButton").disable();

	setTimeout(() => {  wixLocation.to("/blank-5"); }, 250);
}

export function sendS2022Test(event) {
	$w("#viewContestButton").label = "Loading...";
	$w("#viewContestButton").collapseIcon();
	$w("#viewContestButton").disable();

	setTimeout(() => {  wixLocation.to("/test-contest"); }, 250);
}
