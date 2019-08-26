/**
 * View image tile.
 * @module components/manage/Tiles/Hero/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';

/**
 * View image tile class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => (
  <div className="columnsWrapper">
    <div className="left-column">
      {data.left}
    </div>
    <div className="right-column">
      {data.right}
    </div>
  </div>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;