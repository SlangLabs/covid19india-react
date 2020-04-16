/**
 * This code integrates voice queires to the dashboard with Slang.
 */

import Slang from 'slang-web-sdk';
import {buddyId, apiKey} from './buddy.js';
import {hints} from './buddyHelper';
import './slang.css';
import ReactGA from 'react-ga';

let theDistricts = [];
let selectedLocale = localStorage.getItem('slangLocale') || 'en-IN';
const env = 'stage';
let speakOut = false;
let speakText = '';

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
    Slang.builtinUi.setConfig({
      overridenOnTriggerClick: async () => {
        const lastUsed = localStorage.getItem('SlangLastUsed' + selectedLocale);
        if (!lastUsed || Number(lastUsed) + 86400000 < Date.now()) {
          speakOut = true;
        } else {
          speakOut = false;
        }
        if (selectedLocale === 'hi-IN') {
          speakText =
            "आपका स्वागत है. अब अपने ज़िले में CoVid19 के पुष्ट मामलों की संख्या खोजने के लिए ज़िले का नाम बोले, जैसे की 'मुंबई'";
        } else {
          speakText =
            "Welcome. Now search for confirmed CoVid19 cases in your district by saying the district name, like 'Mumbai'";
        }
        Slang.startConversation(speakText, speakOut);
        localStorage.setItem('SlangLastUsed' + selectedLocale, Date.now());
      },
    });
  },
  onFailure: () => {
    console.log('Slang Failed to initialize'); // anything you want to do once slang fails to init
  },
});

// arrays of ASR biasing words for each locale

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
  orderQuery,
  newQuery,
  number,
}) => {
  console.log(caseFor, dataTypeQuery, districtQuery, stateQuery, number);
  switch (caseFor) {
    case 'replyWithOrder':
      return (
        'The state with the ' +
        orderQuery +
        ' ' +
        dataTypeQuery +
        ' cases in India is ' +
        stateQuery +
        ' with ' +
        number +
        ' cases'
      );
    case 'replyWithDistricts':
      if (selectedLocale === 'hi-IN') {
        return (
          districtQuery +
          ' में ' +
          (newQuery ? 'नया ' : '') +
          'पुष्ट मामलो की संख्या ' +
          number +
          ' है '
        );
      }
      return (
        (newQuery ? 'New confirmed' : 'Confirmed') +
        'cases in ' +
        districtQuery +
        ' are ' +
        number
      );
    case 'replyWithStates':
      if (selectedLocale === 'hi-IN') {
        switch (dataTypeQuery) {
          case 'active':
            return (
              stateQuery +
              ' मैं ' +
              (newQuery ? 'नया ' : '') +
              'ऐक्टिव कसेस की संख्या ' +
              number +
              ' है '
            );
          case 'confirmed':
            return (
              stateQuery +
              ' में ' +
              (newQuery ? 'नया ' : '') +
              'पुष्ट मामलो की संख्या ' +
              number +
              ' है '
            );
          case 'recovered':
            return (
              stateQuery +
              ' में ' +
              (newQuery ? 'नय ा' : '') +
              'स्वस्थ होनेवाले मामलों की संख्या ' +
              number +
              ' है '
            );
          case 'deceased':
            return (
              stateQuery +
              ' में ' +
              number +
              (newQuery ? ' नए' : '') +
              ' लोगो की मौत हो चुकी हैं '
            );
          default:
            console.log('data type not found');
            break;
        }
      }
      return (
        (newQuery ? 'New ' : '') +
        dataTypeQuery +
        ' cases in ' +
        stateQuery +
        ' are ' +
        number
      );
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

  /* Data looks like this
  {
			"active": "7780",
			"confirmed": "9166",
			"deaths": "325",
			"deltaconfirmed": "714",
			"deltadeaths": "36",
			"deltarecovered": "89",
			"lastupdatedtime": "12/04/2020 21:00:24",
			"recovered": "1061",
			"state": "Total",
			"statecode": "TT"
		},
  */
  const numberFromState = (state, dataTypeQuery, newQuery) => {
    console.log('state = ');
    console.log(state);
    if (!newQuery) {
      return parseInt(state[dataTypeQuery]);
    } else if (dataTypeQuery === 'active') {
      return null; // no deltaactive
    } else {
      return parseInt(state['delta' + dataTypeQuery]);
    }
  };

  /*
    Data looks like this =
      {
        "confirmed": 13,
        "lastupdatedtime": "",
        "delta": {
          "confirmed": 0
        }
      }
  */
  const numberFromDistrict = (district, dataTypeQuery, newQuery) => {
    console.log('distict = ');
    console.log(district);
    if (dataTypeQuery !== 'confirmed') {
      return null;
    } else {
      return parseInt(newQuery ? district.delta.confirmed : district.confirmed);
    }
  };

  const replyWithStates = (intent) => {
    index = district = state = undefined;

    const stateQuery =
      intent.getEntity('state').isResolved &&
      intent.getEntity('state').value.trim().toLowerCase();
    const dataTypeQuery = intent.getEntity('data_type').isResolved
      ? intent.getEntity('data_type').value.trim().toLowerCase()
      : 'confirmed';
    const newQuery =
      intent.getEntity('new_type').isResolved &&
      intent.getEntity('new_type').value.trim().toLowerCase();

    const theNumber =
      stateQuery &&
      states.find((item, i) => {
        index = i;
        return item.state.trim().toLowerCase() === stateQuery;
      });

    console.log('dataTypeQuery = ' + dataTypeQuery);
    console.log('newQuery = ' + newQuery);
    console.log('stateQuery = ' + stateQuery);
    console.log(
      'theNumber[state] = ' +
        numberFromState(theNumber, dataTypeQuery, newQuery)
    );
    if (
      dataTypeQuery &&
      stateQuery &&
      theNumber &&
      numberFromState(theNumber, dataTypeQuery, newQuery)
    ) {
      props.onHighlightState(theNumber, index);
      window.location.hash = '#MapStats';
      const prompt = replyValues({
        caseFor: 'replyWithStates',
        dataTypeQuery,
        stateQuery,
        newQuery,
        number: numberFromState(theNumber, dataTypeQuery, newQuery),
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
    const newQuery =
      intent.getEntity('new_type').isResolved &&
      intent.getEntity('new_type').value.trim().toLowerCase();

    if (dataTypeQuery && dataTypeQuery !== 'confirmed') {
      const prompt = replyValues({
        caseFor: 'noDataDistrict',
      });

      Slang.startConversation(prompt, true);
    } else {
      console.log('confirmed district');
      const theNumberDistrictConfirmed =
        districtQuery &&
        theDistricts.reduce((acc, item) => {
          if (item.name.trim().toLowerCase() === districtQuery) {
            index = item.state;
            district = item.name;
            state = item;
            return numberFromDistrict(item, 'confirmed', newQuery);
          }
          return acc;
        }, '');
      console.log(theNumberDistrictConfirmed);
      if (theNumberDistrictConfirmed) {
        window.location.hash = '#MapStats';
        index = states.findIndex((x) => x.state === index);
        props.onHighlightDistrict(district, state, index);
        const prompt = replyValues({
          caseFor: 'replyWithDistricts',
          districtQuery,
          newQuery,
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

  const replyWithCountry = (intent) => {
    index = district = state = undefined;

    let stateQuery = 'total';
    const countryQuery = intent.getEntity('country').isResolved
      ? intent.getEntity('country').value.trim()
      : 'India';
    const orderQuery =
      intent.getEntity('order').isResolved &&
      intent.getEntity('order').value.trim().toLowerCase();
    const dataTypeQuery = intent.getEntity('data_type').isResolved
      ? intent.getEntity('data_type').value.trim().toLowerCase()
      : 'confirmed';
    const newQuery =
      intent.getEntity('new_type').isResolved &&
      intent.getEntity('new_type').value.trim().toLowerCase();

    console.log('countryQuery = ' + countryQuery);
    if (countryQuery !== 'India') {
      Slang.startConversation('We curently support data only for India', true);
    } else if (orderQuery) {
      console.log('orderQuery = ' + orderQuery);
      console.log('dataTypeQuery = ' + dataTypeQuery);
      let highestState = states[1].state;
      let highestValue = numberFromState(states[1], dataTypeQuery, newQuery);
      let lowestState = states[1].state;
      let lowestValue = numberFromState(states[1], dataTypeQuery, newQuery);

      states.forEach((item, i) => {
        if (item.state === 'Total') return;

        if (parseInt(item[dataTypeQuery]) > highestValue) {
          highestValue = numberFromState(item, dataTypeQuery, newQuery);
          highestState = item.state.trim().toLowerCase();
        }
        if (parseInt(item[dataTypeQuery]) < lowestValue) {
          lowestValue = numberFromState(item, dataTypeQuery, newQuery);
          lowestState = item.state.trim().toLowerCase();
        }
      });

      let numberQuery;

      if (orderQuery === 'highest') {
        stateQuery = highestState;
        numberQuery = highestValue;
      } else {
        stateQuery = lowestState;
        numberQuery = lowestValue;
      }

      // props.onHighlightState(theNumber, index);
      window.location.hash = '#MapStats';
      const prompt = replyValues({
        caseFor: 'replyWithOrder',
        dataTypeQuery,
        stateQuery,
        orderQuery: orderQuery,
        newQuery,
        number: numberQuery,
      });
      Slang.startConversation(prompt, true);
    } else {
      console.log('India query = ' + dataTypeQuery);
      const theNumber =
        stateQuery &&
        states.find((item, i) => {
          index = i;
          return item.state.trim().toLowerCase() === stateQuery;
        });

      console.log('dataTypeQuery = ' + dataTypeQuery);
      console.log('stateQuery = ' + stateQuery);
      console.log(theNumber);
      console.log(
        'theNumber[state] = ' +
          numberFromState(theNumber, dataTypeQuery, newQuery)
      );

      if (
        dataTypeQuery &&
        stateQuery &&
        theNumber &&
        numberFromState(theNumber, dataTypeQuery, newQuery)
      ) {
        props.onHighlightState(theNumber, index);
        window.location.hash = '#MapStats';
        const prompt = replyValues({
          caseFor: 'replyWithStates',
          dataTypeQuery,
          stateQuery: 'India',
          newQuery,
          number: numberFromState(theNumber, dataTypeQuery, newQuery),
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
    index = district = state = undefined;
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
      console.log(intent);
      switch (intent.name) {
        case 'reply_with_districts':
          replyWithDistricts(intent);
          return true;

        case 'reply_with_states':
          replyWithStates(intent);
          return true;

        case 'reply_with_country':
          replyWithCountry(intent);
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
