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
  blocks as defaultBlocks,
} from '@plone/volto/config';

import TopicsView from '~/components/theme/View/TopicsView';
import TopicsTabView from '~/components/theme/View/TopicsTabView';
import CKEditorWidget from '~/components/manage/Widgets/CKEditor';

import TextBlockEdit from '~/components/manage/Blocks/Text/Edit';
import TextBlockView from '~/components/manage/Blocks/Text/View';

import { DataTileEdit, DataTileView } from 'volto-datablocks';

import { sparql_data } from 'volto-datablocks/reducers';

import { voltoConfig as mosaicConfig } from 'volto-mosaic/config';
import { voltoConfig as dataBlocksConfig } from 'volto-datablocks/config';

export const settings = {
  ...defaultSettings,
};

export const views = {
  ...defaultViews,
  layoutViews: {
    ...defaultViews.layoutViews,
    topics_view: TopicsView,
    topic_tab_view: TopicsTabView,
  },
};

export const widgets = {
  ...defaultWidgets,
  widget: {
    ...defaultWidgets.widget,
    cktext: CKEditorWidget,
  },
};

export const blocks = {
  ...defaultBlocks,

  blocksConfig: {
    ...defaultBlocks.blocksConfig,
    cktext: {
      id: 'cktext',
      group: 'text',
      title: 'CKEditor',
      view: TextBlockView,
      edit: TextBlockEdit,
      icon: defaultBlocks.blocksConfig.text.icon,
    },
    sparqlisting: {
      id: 'sparqlisting',
      group: 'text',
      title: 'SPARQL Listing',
      view: DataTileView,
      edit: DataTileEdit,
      icon: defaultBlocks.blocksConfig.text.icon,
    },
  },
};

export const addonReducers = [sparql_data];

const config = {
  ...dataBlocksConfig,
  ...mosaicConfig,
  blocks,
  addonReducers,
  views,
  settings,
  widgets,
};

export default config;
