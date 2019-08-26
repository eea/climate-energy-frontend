/**
 * Root reducer.
 * @module reducers/root
 */

import defaultReducers from '@plone/volto/reducers';
import frontpage_slides from '~/reducers/frontpage_slides'
import folder_header from '~/reducers/folder_header'
/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
const reducers = {
  ...defaultReducers,
  frontpage_slides,
  folder_header
  // Add your reducers here
};

export default reducers;
