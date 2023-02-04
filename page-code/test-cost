import { authentication, currentMember } from 'wix-members';
import { getTeamId, getTeamData, getRankData, trade } from 'backend/firebase.jsw';
import { getPrice } from 'backend/yahoo-finance.jsw';
import wixLocation from 'wix-location';

const CONTEST = "test-spring-2023";

$w.onReady(async function () {
	//get member + team info
	const member = await currentMember.getMember();
	const userId = member._id;
	const teamId = await getTeamId(userId, CONTEST);
	
	//get all team data
	const team = await getTeamData(teamId, CONTEST);
	const port = team.portfolio;
	const hist = team.history;
	const bp = team.bp;
	const cash = team.cash;
	const val = team.total_val;

	//load in rankings
	const rankings = await getRankData(CONTEST);

	//display port data
	for (let i = 0; i < port.length; i++) {
		let cur = port[i];
		let cur_price = await getPrice(cur.ticker);
		port[i]["current_price"] = cur_price;
		port[i]["total_value"] = cur_price * cur.qty;
		console.log(port[i]);
	}
	$w("#portTable").rows = [];
	$w("#portTable").rows = port;

	$w("#bpText").text = bp.toString();
	$w("#cashText").text = cash.toString();
	$w("#pvText").text = val.toString();

	//display rankings
	$w("#rankTable").rows = [];
	$w("#rankTable").rows = rankings;

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
	const ticker = $w("#tickerInput").value.toUpperCase();
	const amt = $w("#amtInput").value;
	const qty = parseFloat(amt);
	const date = Date.now(); //update to be actual date
	const price = await getPrice(ticker); //add catch if not valid ticker

	//do some input validation
	$w("#tickerInput").onCustomValidation( (value, reject) => {if(value != "" && price == -1) reject("Ticker is not valid!");});
	$w("#tickerInput").onCustomValidation( (value, reject) => {if(price < 0.01) reject("Asset must be worth at least $0.01!");}, false);
	$w("#tickerInput").onCustomValidation( (value, reject) => {if(value == "") reject("Ticker is missing!");}, false);
	$w("#amtInput").onCustomValidation( (value, reject) => {if(amt == "") reject("Amount is missing!");});
	$w("#amtInput").onCustomValidation( (value, reject) => {
		if(!Number.isInteger(parseFloat(qty)) || parseInt(qty) <= 0) reject("Amount is not a valid integer!");}, false);

	$w("#tickerInput").updateValidityIndication();
	$w("#amtInput").updateValidityIndication();

	if (!$w('#tickerInput').valid) {
		showInfo(false, $w('#tickerInput').validationMessage);
	} else {
		showInfo($w('#amtInput').valid, $w('#amtInput').validationMessage);
	}
	
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

		if (res) {
			showInfo(true, "Trade was successful!");
			$w("#tickerInput").value = "";
			$w("#amtInput").value = "";
		}
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
