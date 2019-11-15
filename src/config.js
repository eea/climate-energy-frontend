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

// import { DataBlockEdit, DataBlockView } from 'volto-datablocks';

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
  },
};

export const addonReducers = [];
