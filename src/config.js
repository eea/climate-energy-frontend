/**
 * Add your config changes here.
 * @module config
 * @example
 * export const settings = {
 *   ...defaultSettings,
 *   port: 4300,
 *   listBlockTypes: {
 *     ...defaultSettings.listBlockTypes,
 *     'my-list-item',
 *   }
 * }
 */

import {
  settings as defaultSettings,
  views as defaultViews,
  widgets as defaultWidgets,
  tiles as defaultTiles,
} from '@plone/volto/config';


import TwoColumnsTileEdit from './components/manage/Tiles/TwoColumnsTIle/Edit'
import TwoColumnsTileView from './components/manage/Tiles/TwoColumnsTIle/View'

import { CountryView } from './components'
import React from 'react';
import createInlineStyleButton from 'draft-js-buttons/lib/utils/createInlineStyleButton';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import underlineSVG from '@plone/volto/icons/underline.svg';
import divideVertical from '@plone/volto/icons/divide-vertical.svg';

const Columns = createInlineStyleButton({
  style: 'UNDERLINE',
  children: <Icon name={underlineSVG} size="24px" />,
});

export const settings = {
  ...defaultSettings,
  richTextEditorInlineToolbarButtons: [
    Columns,
    ...defaultSettings.richTextEditorInlineToolbarButtons,
  ],
};

export const views = {
  ...defaultViews,
  layoutViews: {
    ...defaultViews.layoutViews,
    full_view: CountryView
  }
};

export const widgets = {
  ...defaultWidgets,
};

export const tiles = {
  ...defaultTiles,
  customTiles: [
    ...defaultTiles.customTiles,
    {
      title: 'twocolumn',
      icon: divideVertical
    }
  ],
  defaultTilesViewMap: {
    ...defaultTiles.defaultTilesViewMap,
    twocolumn: TwoColumnsTileView
  },
  defaultTilesEditMap: {
    ...defaultTiles.defaultTilesEditMap,
    twocolumn: TwoColumnsTileEdit
  },
  // messagesTiles: defaultTiles.messagesTiles,
  // requiredTiles: defaultTiles.requiredTiles,
  // sidebarComponents: {
  //   ...defaultTiles.sidebarComponents
  // }
};
