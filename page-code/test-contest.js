import { authentication, currentMember } from 'wix-members';
import { getTeamId, getTeamData, getTeamsData, trade, getPortVal } from 'backend/firebase.jsw';
import { getPrice } from 'backend/yahoo-finance.jsw';
import wixLocation from 'wix-location';

const CONTEST = "test-spring-2023";

//turn number into currency format
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

//reverse currency format to number
function deFormat(number) { return parseFloat(number.substring(1).replace(/,/g, ""));}

$w.onReady(async function () {
	//get member + team info
	let member = await currentMember.getMember();
	const userId = member._id;
	const teamId = await getTeamId(userId, CONTEST);
	if (teamId == -1) wixLocation.to('/contests');

	//load in all the teams
	const teams = await getTeamsData(CONTEST);

	//init curr team data
	let username = "";
	let port = {};
	let hist = [];
	let bp;
	let cash;
	let val = "";

	//compile rankings
	let rankings = [];
	for (let curr of teams) {
		let teamData = curr.teamData;
		let cur_val = await getPortVal(teamData);
		cur_val = formatter.format(cur_val);

		if (curr.teamId == teamId) {
			username = teamData.name;
			port = teamData.portfolio;
			hist = teamData.history;
			bp = teamData.bp;
			cash = teamData.cash;
			val = cur_val;
		}

		rankings.push({"Place": 0, "Name": teamData.name, "total_val": cur_val})
	}
	rankings.sort( (a, b) => deFormat(b.total_val) - deFormat(a.total_val));
	rankings.forEach( (rank, i) => { rank.Place = i + 1 });

	//display rankings
	$w("#rankTable").rows = [];
	$w("#rankTable").rows = rankings;

	//display username
	$w("#nameText").text = username;

	//change port to array
	let portArray = []
	for (let ticker in port) {portArray.push(port[ticker]);}

	//process port data
	for (let i = 0; i < portArray.length; i++) {
		let cur = portArray[i];
		let cur_price = await getPrice(cur.ticker);
		portArray[i]["current_price"] = formatter.format(cur_price);
		portArray[i]["total_value"] = formatter.format(cur_price * cur.qty);
	}

	//display port
	$w("#portTable").rows = [];
	$w("#portTable").rows = portArray;

	$w("#bpText").text = bp;
	$w("#cashText").text = cash;
	$w("#pvText").text = val;

	//close position option
	let repData = [];
	for (let i = 0; i < portArray.length; i++) repData.push({"_id": i.toString()});
	$w("#closeRepeater").data = repData;

	//display history
	$w("#histTable").rows = [];
	$w("#histTable").rows = hist;
})

export async function onTrade(event) {
	//disable button to prevent double trade
	$w("#submitButton").disable();
	$w("#submitButton").label = "Loading...";

	//get member + team data
	const member = await currentMember.getMember();
	const userId = member._id;
	const teamId = await getTeamId(userId, CONTEST);

	//get trade data
	const action = $w("#bosDropdown").value;
	let ticker = $w("#tickerInput").value.toUpperCase();
	const amt = $w("#amtInput").value;
	const qty = parseFloat(amt);
	let date = new Date(Date.UTC(1970, 0, 1));
	date.setSeconds(Date.now()/1000);
	console.log(date);
	const price = await getPrice(ticker); //add catch if not valid ticker

	//do some input validation
	$w("#tickerInput").onCustomValidation( (value, reject) => {if(value != "" && price == -1) reject("Ticker is not valid!");});
	$w("#tickerInput").onCustomValidation( (value, reject) => {if(value == "") reject("Ticker is missing!");}, false);
	$w("#tickerInput").onCustomValidation( (value, reject) => {if(price < 0.01) reject("Asset must be worth at least $0.01!");}, false);
	$w("#amtInput").onCustomValidation( (value, reject) => {if(amt == "") reject("Amount is missing!");});
	$w("#amtInput").onCustomValidation( (value, reject) => {
		if(!Number.isInteger(parseFloat(qty)) || parseInt(qty) <= 0) reject("Amount is not a valid integer!");}, false);

	$w("#tickerInput").updateValidityIndication();
	$w("#amtInput").updateValidityIndication();

	if (!$w('#tickerInput').valid) showInfo(false, $w('#tickerInput').validationMessage);
	else showInfo($w('#amtInput').valid, $w('#amtInput').validationMessage);
	
	if ($w('#amtInput').valid && $w('#tickerInput').valid) {
		//do trade using backend function (prob will be in pop up window)
		const tradeData = 
			{ "action": action,
			"ticker": ticker,
			"qty": qty,
			"date": date,
			"price": price,
			"contest": CONTEST }
		let res = await trade(teamId, tradeData);

		if (res) showInfo(true, "Trade was successful!");
		else showInfo(false, "Trade was not successful");
		
		$w("#tickerInput").value = "";
		$w("#amtInput").value = "";
	}

	//enable button again
	$w("#submitButton").enable();
	$w("#submitButton").label = "Submit";
}

async function showInfo(valid, message) {
	console.log(message + " " + valid.toString());
	if (message == "") {
		$w('#infoGroup').collapse();
		return;
	}

	if (!valid) {
		$w("#infoBox").style.backgroundColor = "rgba(255,0,0,0.5)";
	} else {
		$w("#infoBox").style.backgroundColor = "rgba(0,255,0,0.5)";
	}

	$w("#infoText").text = message;
	console.log($w("#infoText").text);
	$w('#infoGroup').expand();
	console.log($w("#infoText").collapsed);
}

export function tradeButton_click(event) {
	$w("#contestBox").changeState("tradeState");
}
export function rankingButton_click(event) {
	$w("#contestBox").changeState("rankingState");
}
export function portfolioButton_click(event) {
	$w("#contestBox").changeState("portfolioState");
}
export function historyButton_click(event) {
	$w("#contestBox").changeState("historyState");
}

export function closeButton_click(event) {
	const data = $w("#closeRepeater").data;
	console.log("data: " + data);
    let clickedItemData = data.find(item => item._id === event.context.itemId);
	let ind = parseInt(clickedItemData._id);
    let pos = $w("#portTable").rows[ind];
	
	$w("#tickerInput").value = pos.ticker;
	$w("#amtInput").value = Math.abs(pos.qty).toString();
	if (pos.qty < 0) $w("#bosDropdown").value = "Buy";
	else $w("#bosDropdown").value = "Sell";
	$w("#contestBox").changeState("tradeState");
}
