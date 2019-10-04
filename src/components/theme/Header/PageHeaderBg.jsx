/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */

import React from 'react';
import headerBg from './topic-bg.jpg';

const PageHeaderBg = () => (
  <div className="page-header">
    <div className="header-navbar" />
    <div style={{ backgroundImage: `url(${headerBg})` }} className="page-bg" />
    <div className="page-bg-overlay" />
  </div>
);

export default PageHeaderBg;
