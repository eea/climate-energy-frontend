/**
 * Root reducer.
 * @module reducers/root
 */

import defaultReducers from '@plone/volto/reducers';
import frontpage_slides from '~/reducers/frontpage_slides'
import folder_header from '~/reducers/folder_header'
import folder_tabs from '~/reducers/folder_tabs'
import default_header_image from '~/reducers/default_header_image'

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
  folder_header,
  default_header_image,
  folder_tabs
  // Add your reducers here
};

export default reducers;
