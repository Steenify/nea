import { combineReducers } from 'redux';
import ehiTechnicalOfficer from './ehi-technical-officer/reducer';
import sitePaperTL from './site-paper-team-leader/reducer';

export default combineReducers({
  ehiTechnicalOfficer,
  sitePaperTL,
});
