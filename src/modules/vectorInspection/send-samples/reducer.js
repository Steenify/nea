import update from 'react-addons-update';
import moment from 'moment';
import {
  VECTOR_INSPECTION_SEND_FILTER,
  VECTOR_INSPECTION_SEND_SAMPLE_LISTING,
  VECTOR_INSPECTION_SEND_SAMPLE_VALIDATE,
  VECTOR_INSPECTION_SEND_SAMPLE_SUBMIT,
  VECTOR_INSPECTION_SEND_SAMPLE_REACCEPT,
  VECTOR_INSPECTION_SEND_SAMPLE_REJECT,
  VECTOR_INSPECTION_SEND_SAMPLE_SELECT,
  VECTOR_INSPECTION_SEND_SAMPLE_RESET,
  VECTOR_INSPECTION_SEND_SAMPLE_SHOW_CONFIRM,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
    isShowConfirm: false,
    errorMessage: null,
  },
  data: {
    scannedSamples: [],
    depositedSamples: [],
    sendSamples: [],
    scannedSample: null,
    workingSample: null,
  },
};

const reducer = (state = { ...initialState }, action) => {
  const { type, payload } = action;

  switch (type) {
    case VECTOR_INSPECTION_SEND_SAMPLE_LISTING.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
        data: {
          depositedSamples: { $set: [] },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_VALIDATE.PENDING:
    case VECTOR_INSPECTION_SEND_SAMPLE_SUBMIT.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          depositedSamples: { $set: payload },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_VALIDATE.SUCCESS: {
      const scannedSample = { ...payload, scannedTime: moment() };
      const {
        data: { scannedSamples },
      } = state;
      const index = scannedSamples.findIndex((sample) => sample.barcodeId === scannedSample.barcodeId);
      if (index >= 0) {
        scannedSamples[index] = { ...scannedSample, isScanned: true };
      } else {
        scannedSamples.push({ ...scannedSample, isScanned: true });
      }
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          scannedSamples: { $set: scannedSamples },
          scannedSample: { $set: scannedSample },
          workingSample: { $set: scannedSample },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_SUBMIT.SUCCESS: {
      const l = payload.map((item) => item?.sampleId || '');
      return update(state, {
        ui: {
          isLoading: { $set: false },
          isShowConfirm: { $set: true },
        },
        data: {
          scannedSamples: { $set: state.data.scannedSamples.filter((item) => !l.includes(item.sampleId)) },
          sendSamples: { $set: payload },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_LISTING.ERROR:
    case VECTOR_INSPECTION_SEND_SAMPLE_VALIDATE.ERROR:
    case VECTOR_INSPECTION_SEND_SAMPLE_SUBMIT.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_FILTER: {
      return update(state, {
        data: {
          scannedSamples: { $set: payload },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_SELECT: {
      return update(state, {
        data: {
          workingSample: { $set: payload },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_REJECT:
    case VECTOR_INSPECTION_SEND_SAMPLE_REACCEPT: {
      const {
        data: { scannedSamples },
      } = state;
      const index = scannedSamples.findIndex((item) => item.barcodeId === payload.barcodeId);
      const updatedList = update(scannedSamples, {
        [index]: { $set: { ...scannedSamples[index], ...payload } },
      });
      return update(state, {
        data: {
          scannedSamples: { $set: updatedList },
        },
      });
    }
    case VECTOR_INSPECTION_SEND_SAMPLE_SHOW_CONFIRM:
      return update(state, {
        ui: {
          isShowConfirm: { $set: payload },
        },
        data: {
          sendSamples: { $set: payload ? state.data.sendSamples : [] },
        },
      });
    case VECTOR_INSPECTION_SEND_SAMPLE_RESET:
      return update(state, {
        ui: {
          isLoading: { $set: false },
          isShowConfirm: { $set: false },
          errorMessage: { $set: null },
        },
        data: {
          scannedSamples: { $set: [] },
          depositedSamples: { $set: [] },
          sendSamples: { $set: [] },
          scannedSample: { $set: null },
          workingSample: { $set: null },
        },
      });
    default:
      return state;
  }
};

export default reducer;
