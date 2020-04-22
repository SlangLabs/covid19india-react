import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as Icon from 'react-feather';

import './App.scss';
import Home from './components/home';
// import Navbar from './components/navbar';
import Links from './components/links';
import FAQ from './components/faq';
import PatientDB from './components/patientdb';
import DeepDive from './components/deepdive';
import Resources from './components/resources';
import ShareButtons from './components/shareButtons';
/* import PatientDB from './components/patientdb';*/

const history = require('history').createBrowserHistory;

function App() {
  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
      animationDelayForNavbar: 0.2,
    },
    {
      pageLink: '/demographics',
      view: PatientDB,
      displayName: 'Demographics',
      animationDelayForNavbar: 0.3,
    },
    {
      pageLink: '/deepdive',
      view: DeepDive,
      displayName: 'Deep Dive',
      animationDelayForNavbar: 0.4,
    },
    {
      pageLink: '/links',
      view: Links,
      displayName: 'Helpful Links',
      animationDelayForNavbar: 0.4,
    },
    {
      pageLink: '/faq',
      view: FAQ,
      displayName: 'About',
      animationDelayForNavbar: 0.5,
    },
    {
      pageLink: '/essentials',
      view: Resources,
      displayName: 'Essentials',
      animationDelayForNavbar: 0.7,
    },
  ];

  return (
    <div className="App">
      <Router history={history}>
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              {/* <Navbar pages={pages} /> */}
              <div
                className="MiniBanner fadeInUp"
                style={{animationDelay: '0.2s'}}
              >
                <div className="snippet">
                  {
                    'Help the battle against CoVid19 by sharing this dashboard with your friends and family to curb fake news.'
                  }
                  <br />
                  <ShareButtons />
                </div>
              </div>
              <Route exact path="/" render={() => <Redirect to="/" />} />
              <Switch location={location}>
                {pages.map((page, i) => {
                  return (
                    <Route
                      exact
                      path={page.pageLink}
                      component={page.view}
                      key={i}
                    />
                  );
                })}
                <Redirect to="/" />
              </Switch>
            </div>
          )}
        />
      </Router>

      <footer className="fadeInUp" style={{animationDelay: '2s'}}>
        {/* <img
          src="/icon.png"
          alt="https://www.covid19india.org | Coronavirus cases live dashboard"
        /> 
        <Banner /> */}
        <div className="MiniBanner fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="snippet">
            Thanks to the amazing folks @{' '}
            <a
              href="https://www.covid19india.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              covid19india.org
            </a>{' '}
            for the original code and data
            <br />
          </div>
        </div>
        <h5>We stand with everyone fighting on the frontlines</h5>
        <div className="link">
          <a
            href="https://github.com/covid19india"
            target="_blank"
            rel="noopener noreferrer"
          >
            covid19india
          </a>
        </div>
        <a
          href="https://github.com/SlangLabs/covid19india-react"
          className="button github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon.GitHub />
          <span>Open Sourced on GitHub</span>
        </a>
        <a
          className="button excel"
          href="https://bit.ly/patientdb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon.Database />
          <span>Crowdsourced Patient Database&nbsp;</span>
        </a>
        <a
          href="https://twitter.com/covid19indiaorg"
          target="_blank"
          rel="noopener noreferrer"
          className="button twitter"
          style={{justifyContent: 'center'}}
        >
          <Icon.Twitter />
          <span>View updates on Twitter</span>
        </a>
        <a
          href="https://bit.ly/covid19crowd"
          className="button telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon.MessageCircle />
          <span>Join Telegram to Collaborate!</span>
        </a>
        <br />
        <ShareButtons />
        <br />
        <h5>
          {'Voice Enabled by '}
          <a
            href="https://slanglabs.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Slang Labs
          </a>
        </h5>
      </footer>
    </div>
  );
}

export default App;
