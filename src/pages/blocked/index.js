import React from 'react';
import { Link } from 'react-router-dom';
// import Header from 'components/layout/header';
import { ReactComponent as ErrorIcon } from 'assets/svg/error.svg';

import './style.scss';

const Blocked = () => (
  <div className="app__page blocked__page">
    {/* <Header /> */}
    <main className="blocked__content container-fluid">
      <ErrorIcon />
      <h1 className="blocked__title"> We&apos;re sorry!</h1>
      <p className="blocked__des">You do not have access to view this section.</p>
      <Link to="/login">Login</Link>
    </main>
  </div>
);

export default Blocked;
