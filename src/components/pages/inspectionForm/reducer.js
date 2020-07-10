import update from 'react-addons-update';
import uuid from 'uuid/v4';

import {
  INSPECTION_FORM_RESET_REDUCER,
  INSPECTION_FORM_SUBMIT_FINDINGS,
  INSPECTION_FORM_TOGGLE_EDITING_SAMPLE,
  INSPECTION_FORM_CHANGE_SAMPLE_STATUS,
  INSPECTION_FORM_SET_HABITAT_GROUPS,
  INSPECTION_FORM_ADD_FINDING,
  INSPECTION_FORM_REMOVE_FINDING,
  INSPECTION_FORM_CLEAR_SAMPLE,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    isSubmitted: false,
  },
  data: {
    habitatGroups: [],
    editingSampleIds: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  const {
    data: { editingSampleIds, habitatGroups },
  } = state;

  switch (type) {
    case INSPECTION_FORM_SUBMIT_FINDINGS.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case INSPECTION_FORM_SUBMIT_FINDINGS.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: payload },
        },
      });
    }
    case INSPECTION_FORM_SUBMIT_FINDINGS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: null },
        },
      });
    }
    case INSPECTION_FORM_RESET_REDUCER: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: null },
          isSubmitted: { $set: false },
        },
        data: {
          habitatGroups: { $set: [] },
          editingSampleIds: { $set: [] },
        },
      });
    }
    case INSPECTION_FORM_SET_HABITAT_GROUPS: {
      return update(state, {
        data: {
          habitatGroups: { $set: payload },
        },
      });
    }
    case INSPECTION_FORM_TOGGLE_EDITING_SAMPLE: {
      if (editingSampleIds.includes(payload)) {
        return update(state, {
          data: {
            editingSampleIds: { $set: [...editingSampleIds].filter((item) => item !== payload) },
          },
        });
      }
      return update(state, {
        data: {
          editingSampleIds: { $set: [...editingSampleIds, payload] },
        },
      });
    }
    case INSPECTION_FORM_CHANGE_SAMPLE_STATUS: {
      const { hIndex, sIndex, values } = payload;
      return update(state, {
        data: {
          habitatGroups: {
            [hIndex]: {
              samples: {
                [sIndex]: {
                  identificationStatusCode: { $set: values.identificationStatusCode },
                },
              },
            },
          },
        },
      });
    }
    case INSPECTION_FORM_ADD_FINDING: {
      const { hIndex, sIndex } = payload;
      const sample = { ...habitatGroups[hIndex].samples[sIndex] };
      const findingEmpty = {
        sampleId: sample.sampleId,
        findingsId: `local_finding_${uuid()}`,
        specimenCode: '',
        speciesCode: '',
        specimenName: '',
        speciesName: '',
        vectorOfDisease: '',
        purpose: '',
        researcherName: '',
        specimenStage: [],
        specimenType: '',
        remarks: '',
        sampleTreatment: '',
        sampleTreatmentCode: '',
        purposeCode: '',
      };
      return update(state, {
        data: {
          habitatGroups: {
            [hIndex]: {
              samples: {
                [sIndex]: {
                  findings: { $push: [findingEmpty] },
                },
              },
            },
          },
        },
      });
      // sample.findings = values.sampleFindingsVOs;
      // sample.sampleRejectionVO = values.sampleRejectionVO;
      // if (sample.findings) {
      //   sample.findings.push(findingEmpty);
      // } else {
      //   sample.findings = [findingEmpty];
      // }
      // return update(state, {
      //   data: {
      //     habitatGroups: {
      //       [hIndex]: {
      //         samples: {
      //           [sIndex]: { $set: sample },
      //         },
      //       },
      //     },
      //   },
      // });
    }
    case INSPECTION_FORM_REMOVE_FINDING: {
      const { hIndex, sIndex, fIndex } = payload;
      return update(state, {
        data: {
          habitatGroups: {
            [hIndex]: {
              samples: {
                [sIndex]: {
                  findings: { $splice: [[fIndex, 1]] },
                },
              },
            },
          },
        },
      });
    }
    case INSPECTION_FORM_CLEAR_SAMPLE: {
      const { sample, hIndex, sIndex } = payload;
      return update(state, {
        data: {
          habitatGroups: {
            [hIndex]: {
              samples: {
                [sIndex]: { $set: sample },
              },
            },
          },
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
