import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import {
  TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton,
  TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare,
  TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton
} from 'react-twitter-embed';

class LandingComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    };

  }

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }
  componentDidMount() {

  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    // if (oldProps.deliveries !== newProps.deliveries) {

    // }
  }

  render() {
    return (
      <section className="landing-wrapper d-flex">
        <div className="landing-backdrop"></div>
        <div className="home-link fa-arrow-right" >
          <Link to='/home'>
            <IconButton aria-label="menu">
              <ArrowForwardIcon fontSize="large" />
            </IconButton></Link></div>
        <video id="bgvid" playsInline autoPlay muted loop>
          {/* <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm" type="video/webm" />
          <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.mp4" type="video/mp4" /> */}
          <source src="../../public/images/videomp4.mp4" type="video/mp4" />
          <p>This browser does not support the video element.</p>
        </video>
        <div className="landing-content fadeInDown">
          <div className="landing-page-content d-flex">
            <div className="landing-info pr-5">
              <span className="landing-icon"></span>
              <div className="landing-name">
                <span className="small">Developed By</span>
                <span>Team C&W Skillathon</span>
              </div>
            </div>
            <div className="twitter-wrapper pull-right">
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName="IPL"
                options={{ height: 400, width: 300 }}
              />
              <span className="twitter-small">See the latest news from twitter</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    deliveries: state.matches.deliveries
  };
};

export default connect(mapStateToProps)(LandingComponent);
