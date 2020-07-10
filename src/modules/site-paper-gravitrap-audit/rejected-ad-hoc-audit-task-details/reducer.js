// import upload from 'react-addons-update';

const initialState = {
  ui: { isLoading: false },
  data: {},
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    default:
      return state;
  }
};
