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

// import {
//   settings as defaultSettings,
//   views as defaultViews,
//   widgets as defaultWidgets,
//   blocks as defaultBlocks,
// } from '@plone/volto/config';

import TopicsView from '~/components/theme/View/TopicsView';
import TopicsTabView from '~/components/theme/View/TopicsTabView';
import CKEditorWidget from '~/components/manage/Widgets/CKEditor';

import TextBlockEdit from '~/components/manage/Blocks/Text/Edit';
import TextBlockView from '~/components/manage/Blocks/Text/View';

import { DataTileEdit, DataTileView } from 'volto-datablocks';

import { sparql_data } from 'volto-datablocks/reducers';

import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
import { applyConfig as dataBlocksConfig } from 'volto-datablocks/config';

import * as voltoConfig from '@plone/volto/config';

const config = mosaicConfig(dataBlocksConfig(voltoConfig));

export const settings = {
  ...config.settings,
};

export const views = {
  ...config.views,
  layoutViews: {
    ...config.views.layoutViews,
    topics_view: TopicsView,
    topic_tab_view: TopicsTabView,
  },
};

export const widgets = {
  ...config.widgets,
  widget: {
    ...config.widgets.widget,
    cktext: CKEditorWidget,
  },
};

export const blocks = {
  ...config.blocks,

  blocksConfig: {
    ...config.blocks.blocksConfig,
    cktext: {
      id: 'cktext',
      group: 'text',
      title: 'CKEditor',
      view: TextBlockView,
      edit: TextBlockEdit,
      icon: config.blocks.blocksConfig.text.icon,
    },
    sparqlisting: {
      id: 'sparqlisting',
      group: 'text',
      title: 'SPARQL Listing',
      view: DataTileView,
      edit: DataTileEdit,
      icon: config.blocks.blocksConfig.text.icon,
    },
  },
};

export const addonReducers = [sparql_data];
