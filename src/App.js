import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { BrowserRouter } from "react-router-dom";
import HeaderComponent from "./components/common/header";
import DashboardComponent from "./components/dashboardComponent";
import HomeComponent from "./components/homeComponent";
import { Switch, Route } from "react-router-dom";
import SignUpComponent from "./components/signUpComponent";
import LogInComponent from "./components/logInComponent";
import LandingComponent from "./components/landingPageComponent";
import LoadingComponent from "./components/common/loadingComponent";
import FooterComponent from "./components/common/footer";
import AlertComponent from "./components/common/alertComponent";
import AddEditMatchComponent from "./components/addEditMatch";
import playerScorecardComponent from './components/playerScorecardComponent'
import TeamComponent from "./components/teamComponent";
import AddEditDeliveryComponent from "./components/addEditDelivery";
import ManageUserComponent from "./components/manageUserComponent";
import setAuthToken from "./api/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/userActions";
import PrivateRoute from "./components/private-route/privateRouteComponent";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import IconButton from '@material-ui/core/IconButton';

const store = configureStore();
if (sessionStorage.token) {
  const token = sessionStorage.token;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <AlertComponent />
            <LoadingComponent />
             {/* <HeaderComponent />  */}
             <Switch>
              <Route exact path="/" />
              <Route path="/" component={HeaderComponent} />
            </Switch> 
            <section className="master-wrapper">
              <Route exact path="/" component={LandingComponent} />
              <Route exact path="/home" component={HomeComponent} />
              <Route exact path="/team" component={TeamComponent} />
              <Route exact path='/dashboard/:id' component={DashboardComponent} />

              <Route exact path='/playerScorecard' component={playerScorecardComponent} />
              
              {/* <Route exact path='/match' component={AddEditMatchComponent} />
              <Route exact path='/match/:id' component={AddEditMatchComponent} /> */}

              <Switch>
                <PrivateRoute exact path='/manageUser' component={ManageUserComponent} />
                <PrivateRoute exact path='/match/:id' component={AddEditMatchComponent} />
                <PrivateRoute exact path='/match' component={AddEditMatchComponent} />
                <PrivateRoute exact path='/delivery/:id' component={AddEditDeliveryComponent} />
                <PrivateRoute exact path='/delivery' component={AddEditDeliveryComponent} />
              </Switch>
            </section>
            <Switch>
              <Route exact path="/" />
              <Route path="/" component={FooterComponent} />
            </Switch> 
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
