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
		$w('#joinContestButton').disable();
		$w('#logErrText').show();
		console.log("logged out");
	}
});

export async function joinContest(event) {
	$w('#joinContestButton').disable();
	$w('#joinContestButton').label = "Loading...";

	session.setItem("contest", testSpring);
	var curr = await currentMember.getMember();
	let id = curr._id;
	local.setItem("id", id);
	wixWindow.openLightbox("create-join-team");

	$w('#joinContestButton').enable();
	$w('#joinContestButton').label = "Join";
}

export async function sendContest(event) {
	var curr = await currentMember.getMember();
	let id = curr._id;
	local.setItem("id", id);
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
