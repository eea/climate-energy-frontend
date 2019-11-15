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

import TopicsView from '~/components/theme/View/TopicsView';
import TopicsTabView from '~/components/theme/View/TopicsTabView';
import CKEditorWidget from '~/components/manage/Widgets/CKEditor';

import TextTileEdit from '~/components/manage/Tiles/Text/Edit';
import TextTileView from '~/components/manage/Tiles/Text/View';

// import { DataTileEdit, DataTileView } from 'volto-datablocks';

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

export const tiles = {
  ...defaultTiles,

  tilesConfig: {
    ...defaultTiles.tilesConfig,
    cktext: {
      id: 'cktext',
      group: 'text',
      title: 'CKEditor',
      view: TextTileView,
      edit: TextTileEdit,
      icon: defaultTiles.tilesConfig.text.icon,
    },
  },
};
