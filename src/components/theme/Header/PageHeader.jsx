import React from 'react';

import { Logo, SearchWidget, Breadcrumbs } from '@plone/volto/components';
import headerImg from './topic-bg.jpg';
import { connect } from 'react-redux';

function PageHeader(props) {
  console.log(props);
  return (
    <React.Fragment>
      {/* <BodyClass className="homepage" /> */}
      <div className="page-header">
        {props.pathname ? <Breadcrumbs pathname={props.pathname} /> : ''}

        <div
          className="header-bg"
          style={{ backgroundImage: `url(${headerImg})` }}
        />
        <div className="header-bg-overlay">
          {' '}
          <span style={{ display: 'none' }} />{' '}
        </div>
        <Logo isHomepage={false} />
        <div className="searchbar">
          <SearchWidget pathname={props.pathname || ''} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default PageHeader;
