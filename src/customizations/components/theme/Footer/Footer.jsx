/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, List, Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  intlShape,
} from 'react-intl';
import eeaLogo from './ec.svg.png';
import ecLogo from './eea.png';

const messages = defineMessages({
  copyright: {
    id: 'Copyright',
    defaultMessage: 'Copyright',
  },
});

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => (
  <Segment
    role="contentinfo"
    vertical
    padded
    textAlign="center"
    className="footerWrapper"
  >
    <Container>
      <div className="ui vertically divided grid">
        <div className="four column row">
          <div className="column row">
            <p>
              Find information on the EU and its Member States' progress in
              their 2030 targets on climate and energy.
            </p>
          </div>

          <div className="column">
            <div className="footerLogoWrapper">
              <img className="footerLogo" src={eeaLogo} alt="" />
              <img className="footerLogo" src={ecLogo} alt="" />
            </div>
          </div>

          <div className="row" style={{ width: '100%', textAlign: 'left' }}>
            <ul className="unlist">
              <li>
                <Link className="item" to="/legal_notice">
                  <FormattedMessage
                    id="legal_notice"
                    defaultMessage="Legal notice"
                  />
                </Link>
              </li>

              <li>
                <Link className="item" to="/private_policy">
                  <FormattedMessage
                    id="private_policy"
                    defaultMessage="Private policy"
                  />
                </Link>
              </li>
              <li>
                <Link className="item" to="/credits">
                  <FormattedMessage id="Credits" defaultMessage="Credis" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </Segment>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
  intl: intlShape.isRequired,
};

export default injectIntl(Footer);
