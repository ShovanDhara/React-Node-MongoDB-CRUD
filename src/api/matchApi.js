import { requestModifier, httpService } from './apiUtility'

class MatchApi {

	static getAllMatches() {
		return httpService('getAllMatches', 'GET');
	};

	static getDeliveries(id) {
		return httpService(`getAllDeliveries/${id}`, 'GET');
	};
	static getMatch(id) {
		return httpService(`getMatch/${id}`, 'GET');
	};
	static getTotalRunByMatch() {
		return httpService(`getMatchTotalRunPerTeam`, 'GET');
	};
	static getTotalWicketByMatch() {
		return httpService(`getMatchTotalWicketPerTeam`, 'GET');
	};
	static updateMatch(payload, id) {
		return httpService(`updateMatchById/${id}`, 'PUT', payload);
	};
	static deleteMatch(id) {
		return httpService(`deleteMatchById/${id}`, 'DELETE');
	};
	static addMatch(payload) {
		return httpService(`addMatch`, 'POST', payload);
	};
	static getBatsman(payload) {
		return httpService(`getBatsmenByTeamAndMatches`, 'POST', payload);
	};
	static getBowler(payload) {
		return httpService(`getBowlersByTeamAndMatches`, 'POST', payload);
	};
}

export default MatchApi;