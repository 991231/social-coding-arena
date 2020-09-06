import React from "react";
import "./assets/css/App.css";

import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import LandingPage from "./components/LandingPage/LandingPage.js";
import CreateRoom from "./components/Contest/CreateRoom.js";
import WaitingRoom from "./components/Contest/WaitingRoom.js";
import JoinRoom from "./components/Contest/JoinRoom.js";
import EntireWorkspace from "./components/CodeWorkSpace/EntireWorkspace.js";
import FinishRoom from "./components/Contest/FinishRoom.js";
import SignInPage from "./components/LandingPage/SignInPage.js";
import AuthRoute from "./components/Auth/AuthRoute.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={SignInPage} />
          <AuthRoute exact path="/CreateRoom" component={CreateRoom} />
          <AuthRoute exact path="/WaitingRoom" component={WaitingRoom} />
          <AuthRoute
            exact
            path="/WaitingRoom/:roomid/:userid"
            component={WaitingRoom}
          />
          <AuthRoute exact path="/JoinRoom" component={JoinRoom} />
          <Route exact path="/contest" component={EntireWorkspace} />
          <AuthRoute
            exact
            path="/contest/:roomid/:userid"
            component={EntireWorkspace}
          />
          <AuthRoute exact path="/finishroom" component={FinishRoom} />
          <AuthRoute exact path="/finishroom/:roomid" component={FinishRoom} />
          <Route exact path="/dev" component={FinishRoom} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
