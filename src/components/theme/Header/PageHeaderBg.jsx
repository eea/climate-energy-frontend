/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */

import React from 'react';

import Loadable from 'react-loadable';

const headerBg = Loadable({
  loader: () => import('./topic-bg.jpg'),
  loading() {
    return <div>Loading...</div>;
  },
});


const PageHeaderBg = () => (
  <div className="page-header">
    <div className="header-navbar" />
    <div style={{ backgroundImage: `url(${headerBg})` }} className="page-bg" />
    <div className="page-bg-overlay" />
  </div>
);

export default PageHeaderBg;
