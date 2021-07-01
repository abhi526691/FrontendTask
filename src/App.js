import "./App.css";

import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import withAnalytics, { initAnalytics } from "react-with-analytics";

import BlockDashboard from "./components/blockDashboard";
import DistrictDashboard from "./components/districtDashboard";
import HomePage from "./components/homePage";
import { PropTypes } from "prop-types";
import RankingDashboard from "./components/rankingDashbaord";
import React from "react";
import ReactGA from "react-ga";
import ReactPiwik from "react-piwik";
import SchoolDashboard from "./components/schoolDashboard";
import StateDashboard from "./components/stateDashboard";
import TopAppBar from "./components/appBar";
import UserManual from "./components/userManual";
import DownloadReportDashboard from "./components/downloadDashboard";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f7caac",
      contrastText: "#1f3864"
    },
    secondary: {
      main: "#f7caac",
      contrastText: "#000"
    },
    type: "light"
    // text: {
    //   primary: "#fff",
    // }
    // error: will use the default color
  }
});

const siteId = process.env.NODE_ENV === "production" ? 3 : 2;

const piwik = new ReactPiwik({
  url: "www.analytics.cttsamagra.xyz/piwik/",
  siteId: siteId,
  trackErrors: true
});

// Set tracking ID
const GA_TRACKING_ID =
  process.env.NODE_ENV === "production" ? "UA-117691729-4" : "UA-117691729-2";
const debug = process.env.NODE_ENV === "production" ? false : true;
initAnalytics(GA_TRACKING_ID, { debug: debug });

class GAListener extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.sendPageView(this.context.router.history.location);
    this.context.router.history.listen(this.sendPageView);
  }

  sendPageView(location) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }

  render() {
    return this.props.children;
  }
}

const Root = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/school-dashboard/" component={SchoolDashboard} />
    <Route exact path="/block-dashboard/" component={BlockDashboard} />
    <Route exact path="/download-report" component={DownloadReportDashboard} />
    <Route exact path="/district-dashboard/" component={DistrictDashboard} />
    <Route exact path="/state-dashboard/" component={StateDashboard} />
    <Route exact path="/ranking-dashboard/" component={RankingDashboard} />
    <Route exact path="/user-manual/" component={UserManual} />
  </Switch>
);

const AppWithRouter = withRouter(withAnalytics(Root));

function App() {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <TopAppBar />
          <AppWithRouter />
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default App;
