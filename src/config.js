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
};

export const tiles = {
  ...defaultTiles,
};
