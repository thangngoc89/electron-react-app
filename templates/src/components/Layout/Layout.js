import React, { PropTypes } from 'react';
import Header from './Header';
import s from './Layout.css';

function Layout(props) {
  return (
    <div className={s.root}>
      <Header />
      <main className={s.content}>
        <div {...props} className={`${s.content}${props.className ? ` ${props.className}` : ''}`} />
      </main>
    </div>
  );
}

Layout.propTypes = { className: PropTypes.string };

export default Layout;
