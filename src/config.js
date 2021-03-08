import * as voltoConfig from '@plone/volto/config';
import {
  settings as defaultSettings,
  views as defaultViews,
  widgets as defaultWidgets,
  blocks as defaultBlocks,
  addonReducers as defaultAddonReducers,
  addonRoutes as defaultAddonRoutes,
} from '@plone/volto/config';

import {
  applyConfig as addonsConfig,
  installFolderListing,
  // installCustomAddonGroup,
  installTableau,
} from 'volto-addons/config';
import { applyConfig as ckeditorConfig } from 'volto-ckeditor/config';
import { applyConfig as dataBlocksConfig } from 'volto-datablocks/config';
import { applyConfig as blocksConfig } from 'volto-blocks/config';
import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
// import { applyConfig as plotlyConfig } from 'volto-plotlycharts/config';
import { applyConfig as installEnergyFrontend } from './localconfig';
import { applyConfig as installSidebar } from 'volto-sidebar/config';

const config = [
  // installCustomAddonGroup,
  addonsConfig,
  installSidebar,
  installFolderListing,
  installTableau,
  // plotlyConfig,
  ckeditorConfig,
  mosaicConfig,
  blocksConfig,
  dataBlocksConfig,
  installEnergyFrontend,
].reduce((acc, apply) => apply(acc), voltoConfig);

export const settings = {
  ...defaultSettings,
  contentExpand: [
    ...defaultSettings.contentExpand,
    'localnavigation',
    'siblings',
    '&expand.localnavigation.depth=2',
  ],
};

export const views = {
  ...defaultViews,
};

export const widgets = {
  ...defaultWidgets,
  vocabulary: {
    ...defaultWidgets.vocabulary,
    'energy.resource_type': TokenWidget,
    'energy.topics': TokenWidget,
  },
};

export const blocks = {
  ...defaultBlocks,
};

export const addonRoutes = [...defaultAddonRoutes];
export const addonReducers = { ...defaultAddonReducers };
