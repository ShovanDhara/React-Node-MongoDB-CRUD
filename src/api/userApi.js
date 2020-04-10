import { requestModifier, httpService } from './apiUtility'

class UserApi {

	static createUser(user) {
		return httpService('register', 'POST', user);
	};

	static loginUser(user) {
		return httpService('login', 'POST', user);
	};

	static loadUser() {
		return httpService('getAllUser', 'GET');
	};

	static setFavorite(data) {
		return httpService(`setFavorite`, 'PUT', data);
	};
	static updateUserPermission(data) {
		return httpService(`updateUserPermission`, 'PUT', data);
	};
	static deleteUserById(id) {
		return httpService(`deleteUserById/${id}`, 'DELETE');
	};
}

export default UserApi;