import { requestModifier, httpService } from './apiUtility'

class PerformanceApi{

	static getPerformanceData(seasons,batting_team,playerType) {
		return httpService(`getPerformanceData/${seasons}&${batting_team}&${playerType}`, 'GET');
	};

	
}

export default PerformanceApi;