/**
 * This code integrates voice queires to the dashboard with Slang.
 */

import Slang from 'slang-web-sdk';
import {buddyId, apiKey} from './buddy.js';
import './slang.css';
import ReactGA from 'react-ga';

let theDistricts = [];
let selectedLocale = localStorage.getItem('slangLocale') || 'en-IN';
const env = 'prod';

ReactGA.initialize('UA-123830474-3');
// set the default selectable locales on the slang trigger
Slang.requestLocales(['en-IN', 'hi-IN']);
// Initialise Slang with the below params
Slang.initialize({
  buddyId,
  apiKey,
  env, // one of ['stage','prod']
  locale: selectedLocale, // one of ['en-IN','hi-IN']
  onSuccess: () => {
    console.log('Slang initialized successfully'); // anything you want to do once slang gets init successfully
  },
  onFailure: () => {
    console.log('Slang Failed to initialize'); // anything you want to do once slang fails to init
  },
});

// arrays of ASR biasing words for each locale
const hints = {
  'en-IN': [
    'active',
    'recovered',
    'deceased',
    'confirmed',
    'active cases',
    'recovered cases',
    'deceased cases',
    'confirmed cases',
  ],
  'en-US': [
    'active',
    'recovered',
    'deceased',
    'confirmed',
    'active cases',
    'recovered cases',
    'deceased cases',
    'confirmed cases',
  ],
};
// set the above hints
Slang.setASRHints(hints);

const uiObs = (UIState) => {
  if (UIState.selectedLocale !== selectedLocale) {
    selectedLocale = UIState.selectedLocale;
    localStorage.setItem('slangLocale', selectedLocale);
  }
};
Slang.registerUIObserver(uiObs);

const replyValues = ({
  caseFor,
  dataTypeQuery,
  districtQuery,
  stateQuery,
  number,
}) => {
  console.log(caseFor, dataTypeQuery, districtQuery, stateQuery, number);
  switch (caseFor) {
    case 'replyWithDistricts':
      if (selectedLocale === 'hi-IN') {
        return districtQuery + ' में पुष्ट मामलो की संख्या ' + number + ' है ';
      }
      return 'Confirmed cases in ' + districtQuery + ' is ' + number;
    case 'replyWithStates':
      if (selectedLocale === 'hi-IN') {
        switch (dataTypeQuery) {
          case 'active':
            return stateQuery + ' मैं ऐक्टिव कसेस की संख्या ' + number + ' है ';
          case 'confirmed':
            return stateQuery + ' में पुष्ट मामलो की संख्या ' + number + ' है ';
          case 'recovered':
            return (
              stateQuery +
              ' में स्वस्थ होनेवाले मामलों की संख्या ' +
              number +
              ' है '
            );
          case 'deceased':
            return stateQuery + ' में ' + number + ' लोगो की मौत हो चुकी हैं ';
          default:
            console.log('data type not found');
            break;
        }
      }
      return dataTypeQuery + ' cases in ' + stateQuery + ' is ' + number;
    case 'noDataDistrict':
      if (selectedLocale === 'hi-IN') {
        return 'माफ़ करिये ।अभी हमारे पास ज़िला स्तर पर ख़ाली पुष्ट मामलों की संख्या है';
      } else {
        return 'Sorry. Data is available only for confirmed cases currently at a district level';
      }
    case 'noDataState':
      if (selectedLocale === 'hi-IN') {
        return 'माफ़ करिये अभी हमारे पास इस का उत्तर नहीं है।';
      } else {
        return "We couldn't find data for your query.";
      }
    default:
      return false;
  }
};

function SlangInterface(props) {
  const {states, stateDistrictWiseData} = props;

  theDistricts = Object.keys(stateDistrictWiseData).reduce((acc, state) => {
    const dist = Object.keys(stateDistrictWiseData[state]['districtData'])
      .filter((i) => i.toLowerCase() !== 'unknown')
      .map((district) => ({
        name: district,
        state: state,
        ...stateDistrictWiseData[state]['districtData'][district],
      }));
    return [...acc, ...dist];
  }, []);

  let index;
  let district;
  let state;

  const replyWithStates = (intent) => {
    index = district = state = undefined;

    const stateQuery =
      intent.getEntity('state').isResolved &&
      intent.getEntity('state').value.trim().toLowerCase();
    const dataTypeQuery = intent.getEntity('data_type').isResolved
      ? intent.getEntity('data_type').value.trim().toLowerCase()
      : 'confirmed';

    const theNumber =
      stateQuery &&
      states.find((item, i) => {
        index = i;
        return item.state.trim().toLowerCase() === stateQuery;
      });

    if (dataTypeQuery && stateQuery && theNumber && theNumber[dataTypeQuery]) {
      props.onHighlightState(theNumber, index);
      window.location.hash = '#MapStats';
      const prompt = replyValues({
        caseFor: 'replyWithStates',
        dataTypeQuery,
        stateQuery,
        number: theNumber[dataTypeQuery],
      });
      Slang.startConversation(prompt, true);
    } else {
      const prompt = replyValues({
        caseFor: 'noDataState',
      });

      Slang.startConversation(prompt, true);
    }

    window.location.hash = '#_';
    index = district = state = undefined;
  };

  const replyWithDistricts = (intent) => {
    index = district = state = undefined;
    const districtQuery =
      intent.getEntity('district').isResolved &&
      intent.getEntity('district').value.trim().toLowerCase();
    const dataTypeQuery =
      intent.getEntity('data_type').isResolved &&
      intent.getEntity('data_type').value.trim().toLowerCase();
    if (dataTypeQuery && dataTypeQuery !== 'confirmed') {
      const prompt = replyValues({
        caseFor: 'noDataDistrict',
      });

      Slang.startConversation(prompt, true);
    } else {
      const theNumberDistrictConfirmed =
        districtQuery &&
        theDistricts.reduce((acc, item) => {
          if (item.name.trim().toLowerCase() === districtQuery) {
            index = item.state;
            district = item.name;
            state = item;
            return item.confirmed;
          }
          return acc;
        }, '');
      if (theNumberDistrictConfirmed) {
        window.location.hash = '#MapStats';
        index = states.findIndex((x) => x.state === index);
        props.onHighlightDistrict(district, state, index);
        const prompt = replyValues({
          caseFor: 'replyWithDistricts',
          districtQuery,
          number: theNumberDistrictConfirmed,
        });

        Slang.startConversation(prompt, true);
      } else {
        const prompt = replyValues({
          caseFor: 'noDataState',
        });
        Slang.startConversation(prompt, true);
      }
    }
    window.location.hash = '#_';
  };

  try {
    Slang.setOnUtteranceDetected((string) => {
      console.log('utterance - ' + string);
      ReactGA.event({
        category: 'Slang events',
        action: 'trigger click',
      });
    });
    Slang.setIntentActionHandler((intent) => {
      switch (intent.name) {
        case 'reply_with_districts':
          replyWithDistricts(intent);
          return true;

        case 'reply_with_states':
          replyWithStates(intent);
          return true;

        default:
          return false;
      }
    });
  } catch (error) {
    console.log(error);
  }

  return null;
}

// This function is used in the conjunction with the Patients DB of the dashboard to choose the state and or district while searching
export function SlangPatients(props) {
  // read the handleFilters prop of the component
  const {handleFilters} = props;

  try {
    // set the intent handle with slang to perform tasks when an intent from the user is detected.
    Slang.setIntentActionHandler((intent) => {
      switch (intent.name) {
        case 'reply_with_districts':
          // read the district spoken by the user.
          const districtQuery =
            intent.getEntity('district').isResolved &&
            intent.getEntity('district').value.trim(); // .toLowerCase()
          // get the state where is district is in from the list available on the dashboard.

          const theState =
            districtQuery &&
            theDistricts.reduce((acc, item) => {
              if (
                item.name.trim().toLowerCase() === districtQuery.toLowerCase()
              ) {
                return item.state;
              }
              return acc;
            }, '');
          if (theState) {
            handleFilters('detectedstate', theState);
            handleFilters('detecteddistrict', districtQuery);
          }
          return true;
        case 'reply_with_states':
          const stateQuery =
            intent.getEntity('state').isResolved &&
            intent.getEntity('state').value.trim(); // .toLowerCase();
          if (stateQuery) handleFilters('detectedstate', stateQuery);
          return true;
        default:
          return false;
      }
    });
  } catch (error) {
    console.log(error);
  }

  return null;
}

export default SlangInterface;
