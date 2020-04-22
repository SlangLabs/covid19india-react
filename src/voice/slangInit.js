import Slang from 'slang-web-sdk-local';
import {buddyId, apiKey} from './buddy.js';
import {hints} from './buddyHelper';
import './slang.css';
import moment from 'moment';

let selectedLocale = localStorage.getItem('slangLocale') || 'en-IN';
const env = 'stage';
let speakOut = false;
let speakText = '';
// set the default selectable locales on the slang trigger
Slang.requestLocales(['en-IN', 'hi-IN']);
// Initialise Slang with the below params
Slang.initialize({
  buddyId,
  apiKey,
  env, // one of ['stage','prod']
  locale: selectedLocale, // one of ['en-IN','hi-IN']
  onSuccess: () => {
    console.info('Slang initialized successfully'); // anything you want to do once slang gets init successfully
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
    console.info('Slang Failed to initialize'); // anything you want to do once slang fails to init
  },
});

// arrays of ASR biasing words for each locale

// set the above hints
Slang.setASRHints(hints);

const uiObs = (UIState) => {
  if (
    UIState.selectedLocale !== '' &&
    UIState.selectedLocale !== selectedLocale
  ) {
    selectedLocale = UIState.selectedLocale;
    localStorage.setItem('slangLocale', selectedLocale);
    Slang.triggerSlang();
    if (selectedLocale.split('-')[0])
      moment.locale(selectedLocale.split('-')[0]);
  }
};
Slang.registerUIObserver(uiObs);

export const replyValues = ({
  caseFor,
  dataTypeQuery,
  districtQuery,
  stateQuery,
  orderQuery,
  newQuery,
  number,
  lastUpdate,
}) => {
  console.info(
    caseFor,
    dataTypeQuery,
    districtQuery,
    stateQuery,
    number,
    lastUpdate
  );
  let updatedSince = null;
  if (lastUpdate) {
    const dateFormat =
      lastUpdate.length > 10 ? 'DD/MM/YYYY hh:mm:ss' : 'DD/MM/YYYY';
    updatedSince = moment(lastUpdate, dateFormat).fromNow().toString();
  }

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
          ' पुष्ट मामलो की संख्या ' +
          number +
          ' है '
        );
      }
      return (
        (newQuery ? 'New confirmed' : 'Confirmed') +
        ' cases in ' +
        districtQuery +
        ' are ' +
        number +
        (newQuery && updatedSince ? ` , updated ${updatedSince}` : '')
      );
    case 'replyWithStates':
      if (selectedLocale === 'hi-IN') {
        switch (dataTypeQuery) {
          case 'active':
            return (
              stateQuery +
              ' मैं ' +
              (newQuery ? 'नया ' : '') +
              ' ऐक्टिव कसेस की संख्या ' +
              number +
              ' है '
            );
          case 'confirmed':
            return (
              stateQuery +
              ' में ' +
              (newQuery ? 'नया ' : '') +
              ' पुष्ट मामलो की संख्या ' +
              number +
              ' है '
            );
          case 'recovered':
            return (
              stateQuery +
              ' में ' +
              (newQuery ? 'नय ा' : '') +
              ' स्वस्थ होनेवाले मामलों की संख्या ' +
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
        number +
        (newQuery && updatedSince ? ` , updated ${updatedSince}` : '')
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
