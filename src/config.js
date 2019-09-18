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

// Tiles
import ChartTileEdit from '~/components/manage/Tiles/ChartTile/ChartTileEdit';
import ChartTileView from '~/components/manage/Tiles/ChartTile/ChartTileView';

import TableauTileEdit from '~/components/manage/Tiles/TableauTile/TableauTileEdit';
import tableauTileView from '~/components/manage/Tiles/TableauTile/TableauTileView';

import ImageAndRichTextTileEdit from '~/components/manage/Tiles/ImageAndRichTextTile/Edit';
import ImageAndRichTextTileView from '~/components/manage/Tiles/ImageAndRichTextTile/View';

import TextTileEdit from '~/components/manage/Tiles/Text/Edit';
import TextTileView from '~/components/manage/Tiles/Text/View';

// Display types
import CountryView from '~/components/theme/CountryView/CountryView';
import CountryPageView from '~/components/theme/CountryPageView/CountryPageView';
import HomepageView from '~/components/theme/HomepageView/HomepageView';
// import MosaicView from '~/components/theme/MosaicView/MosaicView';

import { layoutViews } from '../volto-mosaic/src';

import React from 'react';
import createInlineStyleButton from 'draft-js-buttons/lib/utils/createInlineStyleButton';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import underlineSVG from '@plone/volto/icons/underline.svg';
import divideVertical from '@plone/volto/icons/divide-vertical.svg';
import chartIcon from '@plone/volto/icons/world.svg';

const Underline = createInlineStyleButton({
  style: 'UNDERLINE',
  children: <Icon name={underlineSVG} size="24px" />,
});

export const settings = {
  ...defaultSettings,
  richTextEditorInlineToolbarButtons: [
    Underline,
    ...defaultSettings.richTextEditorInlineToolbarButtons,
  ],
};

export const views = {
  ...defaultViews,
  layoutViews: {
    ...defaultViews.layoutViews,
    full_view: CountryView,
    country_tab_view: CountryPageView,
    homepage_view: HomepageView,
    // mosaic_tiles_view: MosaicView,
    ...layoutViews,
  },
  contentTypesViews: {
    ...defaultViews.contentTypesViews,
    'Plone Site': HomepageView,
  },
};

export const widgets = {
  ...defaultWidgets,
};

export const tiles = {
  ...defaultTiles,
  customTiles: [
    ...defaultTiles.customTiles,
    {
      title: 'imageandrichtext',
      icon: divideVertical,
    },
    {
      title: 'charttile',
      icon: chartIcon,
    },
    {
      title: 'tableautile',
      icon: chartIcon,
    },
  ],
  defaultTilesViewMap: {
    ...defaultTiles.defaultTilesViewMap,
    imageandrichtext: ImageAndRichTextTileView,
    charttile: ChartTileView,
    tableautile: tableauTileView,
    text: TextTileView,
  },
  defaultTilesEditMap: {
    ...defaultTiles.defaultTilesEditMap,
    imageandrichtext: ImageAndRichTextTileEdit,
    charttile: ChartTileEdit,
    tableautile: TableauTileEdit,
    text: TextTileEdit,
  },
  // messagesTiles: defaultTiles.messagesTiles,
  // requiredTiles: defaultTiles.requiredTiles,
  // sidebarComponents: {
  //   ...defaultTiles.sidebarComponents
  // }
};
