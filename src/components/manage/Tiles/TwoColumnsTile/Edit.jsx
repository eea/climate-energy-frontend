/**
 * Edit Hero tile.
 * @module components/manage/Tiles/Image/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Map } from 'immutable';
import { settings, tiles } from '~/config';
import { readAsDataURL } from 'promise-file-reader';
import { Button, Dimmer, Loader, Message } from 'semantic-ui-react';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor, DefaultDraftBlockRenderMap, EditorState } from 'draft-js';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import EditTextTile from '@plone/volto/components/manage/Tiles/Text/Edit';


import cx from 'classnames';

import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';
import { createContent } from '@plone/volto/actions';
import { Icon } from '@plone/volto/components';

import clearSVG from '@plone/volto/icons/clear.svg';

const messages = defineMessages({
  left: {
    id: 'Left',
    defaultMessage: 'Left',
  },
  right: {
    id: 'Right',
    defaultMessage: 'right',
  },
});

const blockLeftRenderMap = Map({
  unstyled: {
    element: 'div',
  },
});

const blockRightRenderMap = Map({
  unstyled: {
    element: 'div',
  },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(
  blockLeftRenderMap,
);

const extendedDescripBlockRenderMap = DefaultDraftBlockRenderMap.merge(
  blockRightRenderMap,
);

/**
 * Edit image tile class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    tile: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    content: PropTypes.objectOf(PropTypes.any).isRequired,
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeTile: PropTypes.func.isRequired,
    onSelectTile: PropTypes.func.isRequired,
    onDeleteTile: PropTypes.func.isRequired,
    onFocusPreviousTile: PropTypes.func.isRequired,
    onFocusNextTile: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);

    this.onUploadImage = this.onUploadImage.bind(this);
    this.state = {
      uploading: false,
    };

    if (!__SERVER__) {
      let leftEditorState;
      let rightEditorState;
      if (props.data && props.data.left) {
        leftEditorState = EditorState.createWithContent(
          stateFromHTML(props.data.left),
        );
      } else {
        leftEditorState = EditorState.createEmpty();
      }
      if (props.data && props.data.right) {
        rightEditorState = EditorState.createWithContent(
          stateFromHTML(props.data.right),
        );
      } else {
        rightEditorState = EditorState.createEmpty();
      }
  

      this.state = {
        uploading: false,
        leftEditorState,
        rightEditorState,
        currentFocused: 'left',
      };
    }

    this.onchangeleft = this.onchangeleft.bind(this);
    this.onchangeright = this.onchangeright.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.props.selected) {
      this.lefteditor.focus();
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (
      this.props.request.loading &&
      nextProps.request.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
      });
      this.props.onChangeTile(this.props.tile, {
        ...this.props.data,
        url: nextProps.content['@id'],
      });
    }

    if (
      nextProps.data.left &&
      this.props.data.left !== nextProps.data.left &&
      !this.props.selected
    ) {
      const contentState = stateFromHTML(nextProps.data.left);
      this.setState({
        leftEditorState: nextProps.data.left
          ? EditorState.createWithContent(contentState)
          : EditorState.createEmpty(),
      });
    }

    if (
      nextProps.data.right &&
      this.props.data.right !== nextProps.data.right &&
      !this.props.selected
    ) {
      const contentState = stateFromHTML(nextProps.data.right);
      this.setState({
        rightEditorState: nextProps.data.right
          ? EditorState.createWithContent(contentState)
          : EditorState.createEmpty(),
      });
    }

    if (nextProps.selected !== this.props.selected) {
      if (this.state.currentFocused === 'left') {
        this.lefteditor.focus();
      } else {
        this.righteditor.focus();
      }
    }
  }

  /**
   * Change Title handler
   * @method onchangeleft
   * @param {object} leftEditorState Editor state.
   * @returns {undefined}
   */
  onchangeleft(leftEditorState) {
    this.setState({ leftEditorState }, () => {
      this.props.onChangeTile(this.props.tile, {
        ...this.props.data,
        left: leftEditorState.getCurrentContent().getPlainText(),
      });
    });
  }

  /**
   * Change Description handler
   * @method onchangeright
   * @param {object} rightEditorState Editor state.
   * @returns {undefined}
   */
  onchangeright(rightEditorState) {
    this.setState({ rightEditorState }, () => {
      this.props.onChangeTile(this.props.tile, {
        ...this.props.data,
        right: rightEditorState.getCurrentContent().getPlainText(),
      });
    });
  }

  /**
   * Upload image handler
   * @method onUploadImage
   * @returns {undefined}
   */
  onUploadImage({ target }) {
    const file = target.files[0];
    this.setState({
      uploading: true,
    });
    readAsDataURL(file).then(data => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(getBaseUrl(this.props.pathname), {
        '@type': 'Image',
        image: {
          data: fields[3],
          encoding: fields[2],
          'content-type': fields[1],
          filename: file.name,
        },
      });
    });
  }


  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }

    
    return (
      <div
        role="presentation"
        onClick={() => this.props.onSelectTile(this.props.tile)}
        className={cx('tile two-columns', {
          selected: this.props.selected,
        })}
        onKeyDown={e =>
          this.props.handleKeyDown(
            e,
            this.props.index,
            this.props.tile,
            this.node,
            { disableArrowUp: true, disableArrowDown: true },
          )
        }
        ref={node => {
          this.node = node;
        }}
      >
        {this.props.selected && !!this.props.data.url && (
          <div className="toolbar">
            <Button.Group>
              <Button
                icon
                basic
                onClick={() =>
                  this.props.onChangeTile(this.props.tile, {
                    ...this.props.data,
                    url: '',
                  })
                }
              >
                <Icon name={clearSVG} size="24px" color="#e40166" />
              </Button>
            </Button.Group>
          </div>
        )}
        <div className="tile-inner-wrapper columnsWrapper">

          <div className="left-column">
            {/* <EditTextTile
              {...this.props}
            /> */}
            <Editor
                  ref={node => {
                    this.lefteditor = node;
                  }}
                  onChange={this.onchangeleft}
                  editorState={this.state.leftEditorState}
                  blockRenderMap={extendedBlockRenderMap}
                  handleReturn={() => true}
                  placeholder={this.props.intl.formatMessage(messages.left)}
                  blockStyleFn={() => 'right-editor'}
                  onUpArrow={() => {
                    const selectionState = this.state.leftEditorState.getSelection();
                    const { leftEditorState } = this.state;
                    if (
                      leftEditorState
                        .getCurrentContent()
                        .getBlockMap()
                        .first()
                        .getKey() === selectionState.getFocusKey()
                    ) {
                      this.props.onFocusPreviousTile(this.props.tile, this.node);
                    }
                  }}
                  onDownArrow={() => {
                    const selectionState = this.state.leftEditorState.getSelection();
                    const { leftEditorState } = this.state;
                    if (
                      leftEditorState
                        .getCurrentContent()
                        .getBlockMap()
                        .last()
                        .getKey() === selectionState.getFocusKey()
                    ) {
                      this.setState(() => ({ currentFocused: 'right' }));
                      this.righteditor.focus();
                    }
                  }}
                />
            </div>
            <div className="right-column">
            
              <Editor
                ref={node => {
                  this.righteditor = node;
                }}
                onChange={this.onchangeright}
                editorState={this.state.rightEditorState}
                blockRenderMap={extendedDescripBlockRenderMap}
                handleReturn={() => true}
                placeholder={this.props.intl.formatMessage(messages.right)}
                blockStyleFn={() => 'left-editor'}
                onUpArrow={() => {
                  const selectionState = this.state.rightEditorState.getSelection();
                  const currentCursorPosition = selectionState.getStartOffset();

                  if (currentCursorPosition === 0) {
                    this.setState(() => ({ currentFocused: 'left' }));
                    this.lefteditor.focus();
                  }
                }}
                onDownArrow={() => {
                  const selectionState = this.state.rightEditorState.getSelection();
                  const { rightEditorState } = this.state;
                  const currentCursorPosition = selectionState.getStartOffset();
                  const blockLength = rightEditorState
                    .getCurrentContent()
                    .getFirstBlock()
                    .getLength();

                  if (currentCursorPosition === blockLength) {
                    this.props.onFocusNextTile(this.props.tile, this.node);
                  }
                }}
              />
            </div>
        </div>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => ({
      request: state.content.create,
      content: state.content.data,
    }),
    { createContent },
  ),
)(Edit);