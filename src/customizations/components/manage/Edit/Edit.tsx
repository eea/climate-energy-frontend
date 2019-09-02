/**
 * Edit container.
 * @module components/manage/Edit/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { Portal } from 'react-portal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import qs from 'query-string';

import { Form, Icon, Toolbar, Sidebar } from '@plone/volto/components';
import { updateContent, getContent, getSchema } from '@plone/volto/actions';
import { getBaseUrl, hasTilesData } from '@plone/volto/helpers';

import saveSVG from '@plone/volto/icons/save.svg';
import clearSVG from '@plone/volto/icons/clear.svg';


import { Mosaic } from 'react-mosaic-component';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'react-mosaic-component/react-mosaic-component.css';

const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    a: <div>Left Window</div>,
    b: <div>Top Right Window</div>,
    c: <div>Bottom Right Window</div>,
  };
  
  export const app = (
    <div id="app">
      <Mosaic<string>
        renderTile={(id) => ELEMENT_MAP[id]}
        initialValue={{
          direction: 'row',
          first: 'a',
          second: {
            direction: 'column',
            first: 'b',
            second: 'c',
          },
          splitPercentage: 40,
        }}
      />
    </div>
  );