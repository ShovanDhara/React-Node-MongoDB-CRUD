import { httpService } from './apiUtility'
class DeliveryApi
{

    static getAllDeliveries() {
		return httpService('getAllDeliveries', 'GET');
	};	
	static getDelivery(id) {
		return httpService(`getDeliveryDataById/${id}`, 'GET');
	};
	static updateDelivery(payload, _id) {
		return httpService(`updateDeliveryDataById/${_id}`, 'PUT', payload);
	};
	static deleteDelivery(id) {
		return httpService(`deleteMatchById/${id}`, 'DELETE');
	};
	static addDelivery(payload) {
		return httpService(`addDelivery`, 'POST', payload);
	};
}

export default DeliveryApi;