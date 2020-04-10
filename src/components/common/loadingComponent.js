import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as userActions from '../../actions/userActions'

class LoadingComponent extends React.Component {
    render() {
        return (
            <div className="loading-wrapper">
                {this.props.loading ?
                    <div className="spinner-container">
                        {/* <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                            <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                        </svg> */}
                        <div className="spinner-element">
                            <span className="loader"></span>
                        </div>
                    </div>
                    : null}

            </div>
        )
    }
}
LoadingComponent.propTypes = {
    loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        loading: state.ajaxCallsInProgress > 0
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoadingComponent);