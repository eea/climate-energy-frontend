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

import { defineMessages } from 'react-intl';

import ChartBlockEdit from 'volto-blocks/ChartBlock/ChartBlockEdit';
import ChartBlockView from 'volto-blocks/ChartBlock/ChartBlockView';

import EuropeCompareBlockEdit from 'volto-blocks/EuropeCompareBlock/Edit';
import EuropeCompareBlockView from 'volto-blocks/EuropeCompareBlock/View';

import EuropeForestBlockEdit from 'volto-blocks/EuropeForestBlock/Edit';
import EuropeForestBlockView from 'volto-blocks/EuropeForestBlock/View';

import PlotlyBlockEdit from 'volto-blocks/PlotlyChart/Edit';
import PlotlyBlockView from 'volto-blocks/PlotlyChart/View';

import TableauBlockEdit from 'volto-blocks/TableauBlock/TableauBlockEdit';
import tableauBlockView from 'volto-blocks/TableauBlock/TableauBlockView';

import TextBlockEdit from 'volto-blocks/Ckeditor/Edit';
import TextBlockView from 'volto-blocks/Ckeditor/View';


import TextBlockEditWysiwyg from 'volto-blocks/Text/Edit';
import TextBlockViewWysiwyg from 'volto-blocks/Text/View';


import chartIcon from '@plone/volto/icons/world.svg';

import { DataTileEdit, DataTileView } from 'volto-datablocks';

import { sparql_data } from 'volto-datablocks/reducers';
import { chart_data_visualization } from 'volto-blocks/reducers'

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

defineMessages({
  custom_addons: {
    id: 'custom_addons',
    defaultMessage: 'Custom Addons',
  },
  plotly_chart: {
    id: 'plotly_chart',
    defaultMessage: 'Plotly Chart',
  },
  demo_chart: {
    id: 'demo_chart',
    defaultMessage: 'Demo Chart',
  },
  tableau: {
    id: 'tableau',
    defaultMessage: 'Tableau',
  },
  forests_specific: {
    id: 'forests_specific',
    defaultMessage: 'Forests Specific Blocks',
  },
});


export const blocks = {
  // ...config.blocks.defaultBlocks,

  groupBlocksOrder: [
    ...config.blocks.groupBlocksOrder,
    { id: 'custom_addons', title: 'Custom addons' },
    { id: 'forests_specific', title: 'Forests Specific Blocks' },
  ],

  blocksConfig: {
    ...config.blocks.blocksConfig,
    europe_compare_block: {
      id: 'europe_compare_block',
      title: 'Europe Compare Block',
      view: EuropeCompareBlockView,
      edit: EuropeCompareBlockEdit,
      icon: chartIcon,
      group: 'forests_specific',
    },
    europe_forest_block: {
      id: 'europe_forest_block',
      title: 'Europe Forest Area Block',
      view: EuropeForestBlockView,
      edit: EuropeForestBlockEdit,
      icon: chartIcon,
      group: 'forests_specific',
    },
    embed_chart: {
      id: 'embed_chart',
      title: 'Embed Chart',
      view: ChartBlockView,
      edit: ChartBlockEdit,
      icon: chartIcon,
      group: 'custom_addons',
    },
    plotly_chart: {
      id: 'plotly_chart',
      title: 'Plotly Chart',
      view: PlotlyBlockView,
      edit: PlotlyBlockEdit,
      icon: chartIcon,
      group: 'custom_addons',
    },
    tableau: {
      id: 'tableau',
      title: 'Tableau',
      view: tableauBlockView,
      edit: TableauBlockEdit,
      icon: chartIcon,
      group: 'custom_addons',
    },
    cktext: {
      id: 'cktext',
      group: 'text',
      title: 'CKEditor',
      view: config.blocks.blocksConfig.text.view,
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
    wysiwyg: {
      id: 'wysiwyg',
      group: 'text',
      title: 'WYSIWYG',
      view: TextBlockViewWysiwyg,
      edit: TextBlockEditWysiwyg,
      icon: config.blocks.blocksConfig.text.icon,
    }
  },
};

export const addonReducers = [sparql_data, chart_data_visualization];
