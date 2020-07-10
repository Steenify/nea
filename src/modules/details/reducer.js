import { combineReducers } from 'redux';

import form3Reducer from './form3/reducer';
import inspectionReducer from './inspection/reducer';
import letterOfIntentReducer from './letter-of-Intent/reducer';
import sofReducer from './sof/reducer';

export default combineReducers({
  form3Reducer,
  inspectionReducer,
  letterOfIntentReducer,
  sofReducer,
});
