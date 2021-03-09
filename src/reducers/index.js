/**
 * Root reducer.
 * @module reducers/root
 */

import defaultReducers from '@plone/volto/reducers';

// import folder_header from '~/reducers/folder_header';
import folder_tabs from '~/reducers/folder_tabs';
import parent_folder_data from '~/reducers/parent_folder_data';
import localnavigation from '~/reducers/localnavigation';
import quicksearch from '~/reducers/quicksearch';
import index_values from '~/reducers/index_values';

const reducers = {
  ...defaultReducers,
  parent_folder_data,
  folder_tabs,
  localnavigation,
  quicksearch,
  index_values,
  // Add your reducers here
};

export default reducers;
