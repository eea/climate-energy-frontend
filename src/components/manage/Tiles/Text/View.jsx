/**
 * View text tile.
 * @module components/manage/Tiles/Text/View
 */

import PropTypes from 'prop-types';
import React from 'react';
import redraft from 'redraft';
import { settings } from '~/config';

/**
 * View text tile class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => {
  let text = data.text;

  if (typeof data.text === 'string') {
    data.text.replace(/(<? *script)/gi, 'illegalscript');
  } else {
    text = redraft(data.text, settings.ToHTMLRenderers, settings.ToHTMLOptions);
  }
  return data.text ? (
    <div
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  ) : (
    ''
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
