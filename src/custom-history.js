import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();

browserHistory.previous = [];
const _push = browserHistory.push;
const _goBack = browserHistory.goBack;

browserHistory.push = (path, state) => {
  browserHistory.previous.push(browserHistory.location.pathname);
  _push(path, state);
};

browserHistory.goBack = () => {
  // if (browserHistory.previous > 0) {
  //   browserHistory.previous -= 1;
  //   _goBack();
  // } else {
  //   browserHistory.push('/');
  // }
  browserHistory.previous.pop();
  _goBack();
};

export default browserHistory;
