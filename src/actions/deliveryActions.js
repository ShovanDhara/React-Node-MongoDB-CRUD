import * as types from './actionTypes';
import DeliveryApi from '../api/deliveryApi';
import { beginAjaxCall, ajaxCallError, ajaxCallSuccess } from './ajaxCallStatusAction';
import { statusIsError, statusIsSuccess } from './statusAction';

export const getAllDeliveriesSuccess = (deliveries) => {
    return { type: types.LOAD_DELIVERIES_SUCCESS, deliveries };
}
export const getAllDeliveriesError = () => {
    return { type: types.LOAD_DELIVERIES_ERROR };
}
export const getDeliveryDataSuccess = (delivery_data) => {
    return { type: types.DELIVERY_GET_SUCCESS, delivery_data };
}
export const updateDeliveryDataSuccess = (delivery_data) => {
    return { type: types.DELIVERY_UPDATE_SUCCESS, delivery_data };
}
export const addDeliveryDataSuccess = (delivery_data) => {
    return { type: types.DELIVERY_ADD_SUCCESS, delivery_data };
}


export const loadAllDeliveries = () => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return DeliveryApi.getAllDeliveries().then(deliveries => {
            if (deliveries.data) {
                dispatch(getAllDeliveriesSuccess(deliveries.data));
            }
        }).catch(error => {
            dispatch(getAllDeliveriesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};

export const getDeliveryData = (matchid) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return DeliveryApi.getDelivery(matchid).then(delivery => {
            if (delivery.data) {
                dispatch(ajaxCallSuccess());
                return delivery.data;
            }
        }).catch(error => {
            dispatch(getAllDeliveriesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
    
};
export const addDelivery = (payload) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return DeliveryApi.addDelivery(payload).then(delivery => {
            if (delivery.data) {
                dispatch(statusIsSuccess('Delivery data added successfully'));
            }
        }).catch(error => {
            dispatch(getAllDeliveriesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};
export const deleteDelivery = (matchid) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return DeliveryApi.deleteDelivery(matchid).then(delivery => {
            if (delivery.data) {
                dispatch(statusIsSuccess(`${delivery.data} Delivery data deleted successfully`));
            }
        }).catch(error => {
            dispatch(getAllDeliveriesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};

export const updateDelivery = (payload, _id) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return DeliveryApi.updateDelivery(payload, _id).then(delivery => {
            if (delivery.data) {
                dispatch(statusIsSuccess('Delivery data Updated successfully'));
            }
        }).catch(error => {
            dispatch(getAllDeliveriesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};