import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';

import TopicsView from '~/components/theme/View/TopicsView';
import TopicsTabView from '~/components/theme/View/TopicsTabView';

export function applyConfig(config) {
  config.settings.allowed_cors_destinations = ['www.eea.europa.eu'];
  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      topics_view: TopicsView,
      topic_tab_view: TopicsTabView,
    },
  };
  config.widgets = {
    ...config.widgets,
    vocabulary: {
      ...config.widgets.vocabulary,
      'energy.resource_type': TokenWidget,
      'energy.topics': TokenWidget,
    },
  };
  return config;
}
