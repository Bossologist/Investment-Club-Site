import { getTeams, addUserToTeam } from 'backend/firebase.jsw';
import { local, memory, session } from 'wix-storage';
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

$w.onReady(async function () {
	let teamsData = await getTeams(session.getItem("contest"));
	
    //display table of teams
	$w("#teamTable").rows = [];
	$w("#teamTable").rows = teamsData;

    //show repeater
    let repData = [];
    for (let i = 0; i < teamsData.length; i++) {
        let team = teamsData[i];
        repData.push({"_id": i.toString(), "teamId": team.teamId, "pwd": team.pwd});
    }
    $w("#joinContestRep").data = repData;
});

export function joinButton_click(event) {
	let contest = session.getItem("contest");
	let id = local.getItem("id");


    //get data for specific team
    const data = $w("#joinContestRep").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId);
    let teamInd = parseInt(clickedItemData._id);
    let teamData = data[teamInd];

    const teamId = teamData.teamId;
    const pwd = teamData.pwd;

    if (pwd != -1) wixWindow.openLightbox("Enter Password", {"pwd": pwd, "teamId": teamId, "userId": id, "contest": contest});
    else {
        addUserToTeam(contest, id, teamId);
        wixLocation.to('/contests');
    }
}
