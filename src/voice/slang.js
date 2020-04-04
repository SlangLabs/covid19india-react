import Slang from 'slang-web-sdk';

import {buddyId, apiKey} from './buddy.js';
import './slang.css';

Slang.initialize({
  buddyId,
  apiKey,
  env: 'stage', // one of ['stage','prod']
  locale: 'en-IN', // one of ['en-IN','hi-IN']
  onSuccess: () => {
    console.log('Slang initialized successfully'); // anything you want to do once slang gets init successfully
  },
  onFailure: () => {
    console.log('Slang Failed to initialize'); // anything you want to do once slang fails to init
  },
});

function SlangInterface(props) {
  const {states, stateDistrictWiseData} = props;

  const theNumberDistrict = Object.keys(stateDistrictWiseData).reduce(
    (acc, state) => {
      const dist = Object.keys(stateDistrictWiseData[state]['districtData'])
        .filter((i) => i.toLowerCase() !== 'unknown')
        .map((district) => ({
          name: district,
          state: state,
          ...stateDistrictWiseData[state]['districtData'][district],
        }));
      return [...acc, ...dist];
    },
    []
  );

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

    // active: "183"
    // confirmed: "215"
    // deaths: "7"
    // delta: {active: 12, confirmed: 12, deaths: 0, recovered: 0}
    // lastupdatedtime: "30/03/2020 10:02:25"
    // recovered: "25"
    // state: "Maharashtra"
    if (dataTypeQuery && stateQuery && theNumber && theNumber[dataTypeQuery]) {
      props.onHighlightState(theNumber, index);
      window.location.hash = '#MapStats';
      Slang.startConversation(
        dataTypeQuery +
          ' cases in ' +
          stateQuery +
          ' is ' +
          theNumber[dataTypeQuery],
        true
      );
    } else {
      Slang.startConversation("We couldn't find data for your query.", true);
    }

    window.location.hash = '#_';
    index = district = state = undefined;
  };

  const replyWithDistricts = (intent) => {
    index = district = state = undefined;
    const districtQuery =
      intent.getEntity('district').isResolved &&
      intent.getEntity('district').value.trim().toLowerCase();

    const theNumberDistrictConfirmed =
      districtQuery &&
      theNumberDistrict.reduce((acc, item) => {
        if (item.name.trim().toLowerCase() === districtQuery) {
          index = item.state;
          district = item.name;
          state = item;
          console.log(item.confirmed);
          return item.confirmed;
        }
        return acc;
      }, '');
    if (districtQuery && theNumberDistrictConfirmed) {
      window.location.hash = '#MapStats';
      index = states.findIndex((x) => x.state === index);
      props.onHighlightDistrict(district, state, index);

      Slang.startConversation(
        'Confirmed cases in ' +
          districtQuery +
          ' is ' +
          theNumberDistrictConfirmed,
        true
      );
    } else {
      Slang.startConversation("We couldn't find data for your query.", true);
    }
    window.location.hash = '#_';
  };
  try {
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

export default SlangInterface;
