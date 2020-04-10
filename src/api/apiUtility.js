import environment from './environment';
import axios from 'axios';

export const httpService = (url, method, payload) => {
	switch (method) {
		case 'GET':
			return axios.get(`${environment.apiBaseUrl}/${url}`, payload ? payload : null)
				.then(response => {
					return response;
				}).catch(error => {
					throw handleError(error)
				});
		case 'POST':
			return axios.post(`${environment.apiBaseUrl}/${url}`, payload ? payload : null)
				.then(response => {
					return response;
				}).catch(error => {
					throw handleError(error)
				});
		case 'DELETE':
			return axios.delete(`${environment.apiBaseUrl}/${url}`, payload ? payload : null)
				.then(response => {
					return response;
				}).catch(error => {
					throw handleError(error)
				});
		case 'PUT':
			return axios.put(`${environment.apiBaseUrl}/${url}`, payload ? payload : null)
				.then(response => {
					return response;
				}).catch(error => {
					throw handleError(error)
				});
		default:
			return;
	}

}

const handleError = (err) => {
	if (err.response.data && Array.isArray(err.response.data)) {
		return err.response.data.toString()
	} else {
		return err.response.data ? err.response.data : 'Something went wrong'
	}
}

const requestHeaders = () => {
	if (sessionStorage.token) {
		return {
			'Authorization': `Bearer ${sessionStorage.token}`
		};
	} else return
};
export default { httpService };