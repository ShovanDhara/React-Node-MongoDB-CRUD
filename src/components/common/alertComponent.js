import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import * as statusAction from '../../actions/statusAction'

class AlertComponent extends React.Component {
    componentDidUpdate() {
        if (this.props.error) {
            this.notifyError(this.props.errorMsg)
        }
        if (this.props.success) {
            this.notifySuccess(this.props.successMsg)
        }
    }

    notifySuccess(msg) {
        toast.success(msg, { onClose: this.toastClosed() })
    };
    notifyError(msg) {
        toast.error(msg, {
            onClose: this.toastClosed()
        })
    };

    toastClosed() {
        this.props.actions.statusReset();
    }
    render() {
        return (
            <ToastContainer autoClose={2000} />
        )
    }
}
AlertComponent.propTypes = {
    success: PropTypes.bool.isRequired,
    successMsg: PropTypes.string.isRequired,
    error: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        error: state.requestState.error,
        errorMsg: state.requestState.errorMsg,
        success: state.requestState.success,
        successMsg: state.requestState.successMsg,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(statusAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(AlertComponent);