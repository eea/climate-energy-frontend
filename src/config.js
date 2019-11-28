import TopicsView from '~/components/theme/View/TopicsView';
import TopicsTabView from '~/components/theme/View/TopicsTabView';
import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';

import * as voltoConfig from '@plone/volto/config';

import { applyConfig as addonsConfig } from 'volto-addons/config';
import { applyConfig as ckeditorConfig } from 'volto-ckeditor/config';
import { applyConfig as dataBlocksConfig } from 'volto-datablocks/config';
import { applyConfig as draftConfig } from 'volto-drafteditor/config';
import { applyConfig as blocksConfig } from 'volto-blocks/config';
import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
import { applyConfig as plotlyConfig } from 'volto-plotlycharts/config';

const config = [
  addonsConfig,
  plotlyConfig,
  ckeditorConfig,
  draftConfig,
  mosaicConfig,
  blocksConfig,
  dataBlocksConfig,
].reduce((acc, apply) => apply(acc), voltoConfig);

export const settings = {
  ...config.settings,
  allowed_cors_destinations: ['www.eea.europa.eu'],
};

export const views = {
  ...config.views,
  layoutViews: {
    ...config.views.layoutViews,
    topics_view: TopicsView,
    topic_tab_view: TopicsTabView,
  },
};

// read @plone/volto/components/manage/Form/Field.jsx to understand this
export const widgets = {
  ...config.widgets,
  vocabulary: {
    ...config.widgets.vocabulary,
    'energy.resource_type': TokenWidget,
    'energy.topics': TokenWidget,
  },
};

export const blocks = {
  ...config.blocks,
};

export const addonReducers = { ...config.addonReducers };
export const addonRoutes = [...(config.addonRoutes || [])];
