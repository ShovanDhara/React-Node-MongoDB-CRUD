import MatchApi from '../api/matchApi';
import { beginAjaxCall, ajaxCallError, ajaxCallSuccess } from '../actions/ajaxCallStatusAction';
import { statusIsError, statusIsSuccess } from '../actions/statusAction';
let nonDuplicateList = [];
let nonDuplicateCityList = [];
let uniqueUmpireList = [];
let uniqueTossDecesion = [];
let uniqueTeamList = [];


export const generateSeasonOptions = () => {
	let list = [];
	const startYear = 2008;
	const endYear = new Date().getFullYear();
	for (let i = startYear; i <= endYear; i++) {
		let listObj = { 'value': i, 'text': i }
		list.push(listObj);
	}

	return list;
}

export const generateTeamNames = () => {

	return uniqueTeamList;
}

export const tossDecision = () => {

	return uniqueTossDecesion;
}

export const umpires = () => {

	return uniqueUmpireList;

}

export const cities = () => {

	return nonDuplicateCityList;

}
export const playerType=()=>{
	const playerTypeList=[ {'text':'Batting', 'value':'bat'},{'text':"Bowling",'value':'field'}];
	return playerTypeList;
}
export const getAllMasterData = () => {

	let venuelist = [];
	let cityList = [];
	let umpiresList = [];
	let tossDecisionList = [];
	let teamList = [];
	MatchApi.getAllMatches().then(matches => {
		if (matches.data) {
			matches.data.filter(item => {
				if (!venuelist.includes(item.venue) && item.venue != '')
					venuelist.push(item.venue);

				if (!cityList.includes(item.city) && item.city != '')
					cityList.push(item.city);

				if (!umpiresList.includes(item.umpire1) && item.umpire1 != '')
					umpiresList.push(item.umpire1);

				if (!tossDecisionList.includes(item.toss_decision) && item.tossDecision != '')
					tossDecisionList.push(item.toss_decision);

				if (!teamList.includes(item.team1) && item.team1 != '')
					teamList.push(item.team1);

			});
			venuelist.sort().map((filter) => {
				nonDuplicateList.push({ text: filter, value: filter })
			});


			cityList.sort().map((filter) => {
				nonDuplicateCityList.push({ text: filter, value: filter })
			});


			umpiresList.sort().map((filter) => {
				uniqueUmpireList.push({ text: filter, value: filter })
			});

			tossDecisionList.sort().map((filter) => {
				let name = '';
				if (filter === 'bat') {
					name = 'Batting'
				}
				if (filter === 'field') {
					name = 'Fielding'
				}
				uniqueTossDecesion.push({ text: name, value: filter })
			});

			teamList.sort().map((filter) => {
				uniqueTeamList.push({ text: filter, value: filter });
			});

		}
	});
}


export const venues = () => {

	getAllMasterData();

	return nonDuplicateList;


}

export default { generateSeasonOptions, generateTeamNames, tossDecision, umpires, cities, venues };