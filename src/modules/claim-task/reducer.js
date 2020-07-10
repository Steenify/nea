import { combineReducers } from 'redux';
import epiInspector from './epi-inspector/reducer';
import epiCOB1 from './epi-cob1/reducer';
import ehiAnalyst from './ehi-analyst/reducer';
import ehiTechnicalOfficer from './ehi-technical-officer/reducer';
import ieuOfficer from './ieu_officer/reducer';

export default combineReducers({ epiInspector, epiCOB1, ehiAnalyst, ehiTechnicalOfficer, ieuOfficer });
