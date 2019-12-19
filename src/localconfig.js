import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';

import TopicsView from '~/components/theme/View/TopicsView';
import TopicsTabView from '~/components/theme/View/TopicsTabView';

export function applyConfig(config) {
  const env_destinations = (process.env.ALLOWED_CORS_DESTINATIONS || '')
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    ...env_destinations,
    'www.eea.europa.eu',
    'eionet.europa.eu',
    'www.eionet.europa.eu',
    'land.copernicus.eu',
  ];
  config.settings.allowed_cors_destinations = allowed_cors_destinations;

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
