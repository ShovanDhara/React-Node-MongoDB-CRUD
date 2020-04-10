import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as matchActions from '../../actions/matchActions'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getInitial, getDateSlider } from '../../commonService/utility'

class CarouselComponent extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            responsive: {
                superLargeDesktop: {
                    breakpoint: { max: 4000, min: 1367 },
                    items: 3,
                    partialVisibilityGutter: 40
                },
                desktop: {
                    breakpoint: { max: 1366, min: 1024 },
                    items: 3,
                    partialVisibilityGutter: 40
                },
                tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2,
                },
                mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1,
                },
            },
            galleryItems: []
        }
        this.viewDetails = this.viewDetails.bind(this);
    }
    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }
    componentDidMount() {
        if (!this.props.allMatches.length) {
            this.props.actions.loadAllMatches()
        }
        else {
            const sliderItems = this.props.allMatches.slice(0, 20);
            this.setState({ galleryItems: sliderItems })
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.allMatches !== prevProps.allMatches) {
            const sliderItems = this.props.allMatches.slice(0, 20);
            this.setState({ galleryItems: sliderItems })
        }
    }
    viewDetails(matchid) {
        this.context.router.history.push("/dashboard/" + matchid);
    }

    render() {
        return (
            <Carousel
                responsive={this.state.responsive}
                swipeable={false}
                infinite={true}
                draggable={false}
                showDots={false}
                autoPlay={true}
                centerMode
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all 1s linear"
                transitionDuration={1000}
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px">
                {this.state.galleryItems.map(row => (
                    <div className="slider-item d-flex" key={row.id} onClick={() => this.viewDetails(row.id)}>
                        <div className="match-info">
                            <p className="winner-info">{row.winner} own by {row.win_by_runs} run and {row.win_by_wickets} wicket</p>
                            <div className="match-data d-flex">
                                <div className={'team team-1 d-flex ' + getInitial(row.team1)}>
                                    <span className={'team-icon b-' + getInitial(row.team1)}></span>
                                    <span className="team-name">{getInitial(row.team1)}</span>
                                </div>
                                <div className="result-data d-flex">
                                    <span className="run"><span>{row.team1TotalRun}</span>/<span>{row.team1TotalWicket}</span></span>
                                    <span className="vs">vs</span>
                                    <span className="run"><span>{row.team2TotalRun}</span>/<span>{row.team2TotalWicket}</span></span>
                                </div>
                                <div className={'team team-2 d-flex ' + getInitial(row.team2)}>
                                    <span className="team-name">{getInitial(row.team2)}</span>
                                    <span className={'team-icon b-' + getInitial(row.team2)}></span>
                                </div>
                            </div>
                        </div>
                        <div className="match-date">
                            {getDateSlider(row.date)}
                        </div>
                    </div>
                ))}
            </Carousel>

        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        allMatches: state.matches.data,
        isLoggedIn: state.user.isLoggedIn,
        isAdmin: state.user.isAdmin,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(matchActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CarouselComponent);