/**
 * View text tile.
 * @module components/manage/Tiles/Text/View
 */

import PropTypes from 'prop-types';
import React from 'react';

/**
 * View text tile class.
 * @class View
 * @extends Component
 */
const View = ({ data }) =>
  data.text ? (
    <div
      dangerouslySetInnerHTML={{
        __html: typeof(data.text) === 'string' ? data.text.replace(/(<? *script)/gi, 'illegalscript') : '',
      }}
    />
  ) : (
    ''
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
