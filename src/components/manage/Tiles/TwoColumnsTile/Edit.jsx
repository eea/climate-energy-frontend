/**
 * Edit text tile.
 * @module components/manage/Tiles/Title/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import Editor from 'draft-js-plugins-editor';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { includes, isEqual } from 'lodash';
import cx from 'classnames';

import { settings, tiles } from '~/config';

import { Icon } from '@plone/volto/components';
import addSVG from '@plone/volto/icons/circle-plus.svg';
import cameraSVG from '@plone/volto/icons/camera.svg';
import videoSVG from '@plone/volto/icons/videocamera.svg';
import TemplatedTilesSVG from '@plone/volto/icons/theme.svg';

const messages = defineMessages({
  text: {
    id: 'Type text…',
    defaultMessage: 'Type text…',
  },
});

class Edit extends Component {
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    detached: PropTypes.bool,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    tile: PropTypes.string.isRequired,
    onAddTile: PropTypes.func.isRequired,
    onChangeTile: PropTypes.func.isRequired,
    onDeleteTile: PropTypes.func.isRequired,
    onMutateTile: PropTypes.func.isRequired,
    onFocusPreviousTile: PropTypes.func.isRequired,
    onFocusNextTile: PropTypes.func.isRequired,
    onSelectTile: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    detached: false,
  };

  constructor(props) {
    super(props);

    if (!__SERVER__) {
      let editorState;
      if (props.data && props.data.text) {
        editorState = EditorState.createWithContent(
          convertFromRaw(props.data.text),
        );
      } else {
        editorState = EditorState.createEmpty();
      }

      const inlineToolbarPlugin = createInlineToolbarPlugin({
        structure: settings.richTextEditorInlineToolbarButtons,
      });

      this.state = {
        editorState,
        inlineToolbarPlugin,
        addNewTileOpened: false,
        customTilesOpened: false,
      };
    }

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.selected) {
      this.node.focus();
    }
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.selected && nextProps.selected) {
      this.node.focus();
      this.setState({
        editorState: EditorState.moveFocusToEnd(this.state.editorState),
      });
    }
  }

  componentWillUnmount() {
    if (this.props.selected) {
      this.node.focus();
    }
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  onChange(editorState) {
    if (
      !isEqual(
        convertToRaw(editorState.getCurrentContent()),
        convertToRaw(this.state.editorState.getCurrentContent()),
      )
    ) {
      this.props.onChangeTile(this.props.tile, {
        ...this.props.data,
        text: convertToRaw(editorState.getCurrentContent()),
      });
    }
    this.setState({ editorState });
  }

  toggleAddNewTile = () =>
    this.setState(state => ({ addNewTileOpened: !state.addNewTileOpened }));

  handleClickOutside = e => {
    if (this.ref && doesNodeContainClick(this.ref, e)) return;
    this.setState(() => ({
      addNewTileOpened: false,
      customTilesOpened: false,
    }));
  };

  openCustomTileMenu = () => this.setState(() => ({ customTilesOpened: true }));

  render() {
    if (__SERVER__) {
      return <div />;
    }

    console.log(this.props);

    const { InlineToolbar } = this.state.inlineToolbarPlugin;

    return (
      <div
        role="presentation"
        onClick={() => this.props.onSelectTile(this.props.tile)}
        className={cx('tile columnsWrapper', { selected: this.props.selected })}
        ref={node => (this.ref = node)}
      >
        <div className="left-column">
          <Editor
            onChange={this.onChange}
            editorState={this.state.editorState}
            plugins={[
              this.state.inlineToolbarPlugin,
              ...settings.richTextEditorPlugins,
            ]}
            blockRenderMap={settings.extendedBlockRenderMap}
            blockStyleFn={settings.blockStyleFn}
            placeholder={this.props.intl.formatMessage(messages.text)}
            handleReturn={() => {
              if (!this.props.detached) {
                const selectionState = this.state.editorState.getSelection();
                const anchorKey = selectionState.getAnchorKey();
                const currentContent = this.state.editorState.getCurrentContent();
                const currentContentBlock = currentContent.getBlockForKey(
                  anchorKey,
                );
                const blockType = currentContentBlock.getType();
                if (!includes(settings.listBlockTypes, blockType)) {
                  this.props.onSelectTile(
                    this.props.onAddTile('text', this.props.index + 1),
                  );
                  return 'handled';
                }
                return 'un-handled';
              }
              return {};
            }}
            handleKeyCommand={(command, editorState) => {
              if (
                command === 'backspace' &&
                editorState.getCurrentContent().getPlainText().length === 0
              ) {
                this.props.onDeleteTile(this.props.tile, true);
              }
            }}
            onUpArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const currentCursorPosition = selectionState.getStartOffset();

              if (currentCursorPosition === 0) {
                this.props.onFocusPreviousTile(this.props.tile, this.node);
              }
            }}
            onDownArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const { editorState } = this.state;
              const currentCursorPosition = selectionState.getStartOffset();
              const blockLength = editorState
                .getCurrentContent()
                .getFirstBlock()
                .getLength();

              if (currentCursorPosition === blockLength) {
                this.props.onFocusNextTile(this.props.tile, this.node);
              }
            }}
            ref={node => {
              this.node = node;
            }}
          />
        </div>
        <div className="right-column">
          <Editor
            onChange={this.onChange}
            editorState={this.state.editorState}
            plugins={[
              this.state.inlineToolbarPlugin,
              ...settings.richTextEditorPlugins,
            ]}
            blockRenderMap={settings.extendedBlockRenderMap}
            blockStyleFn={settings.blockStyleFn}
            placeholder={this.props.intl.formatMessage(messages.text)}
            handleReturn={() => {
              if (!this.props.detached) {
                const selectionState = this.state.editorState.getSelection();
                const anchorKey = selectionState.getAnchorKey();
                const currentContent = this.state.editorState.getCurrentContent();
                const currentContentBlock = currentContent.getBlockForKey(
                  anchorKey,
                );
                const blockType = currentContentBlock.getType();
                if (!includes(settings.listBlockTypes, blockType)) {
                  this.props.onSelectTile(
                    this.props.onAddTile('text', this.props.index + 1),
                  );
                  return 'handled';
                }
                return 'un-handled';
              }
              return {};
            }}
            handleKeyCommand={(command, editorState) => {
              if (
                command === 'backspace' &&
                editorState.getCurrentContent().getPlainText().length === 0
              ) {
                this.props.onDeleteTile(this.props.tile, true);
              }
            }}
            onUpArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const currentCursorPosition = selectionState.getStartOffset();

              if (currentCursorPosition === 0) {
                this.props.onFocusPreviousTile(this.props.tile, this.node);
              }
            }}
            onDownArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const { editorState } = this.state;
              const currentCursorPosition = selectionState.getStartOffset();
              const blockLength = editorState
                .getCurrentContent()
                .getFirstBlock()
                .getLength();

              if (currentCursorPosition === blockLength) {
                this.props.onFocusNextTile(this.props.tile, this.node);
              }
            }}
            ref={node => {
              this.node = node;
            }}
          />
        </div>

        <InlineToolbar />
        {!this.props.detached &&
          (!this.props.data.text ||
            (this.props.data.text &&
              this.props.data.text.blocks &&
              this.props.data.text.blocks.length === 1 &&
              this.props.data.text.blocks[0].text === '')) && (
            <Button
              basic
              icon
              onClick={this.toggleAddNewTile}
              className="tile-add-button"
            >
              <Icon name={addSVG} className="tile-add-button" size="24px" />
            </Button>
          )}
        {this.state.addNewTileOpened && !this.state.customTilesOpened && (
          <div className="add-tile toolbar">
            <Button.Group>
              <Button
                icon
                basic
                onClick={() =>
                  this.props.onMutateTile(this.props.tile, {
                    '@type': 'image',
                  })
                }
              >
                <Icon name={cameraSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                onClick={() =>
                  this.props.onMutateTile(this.props.tile, {
                    '@type': 'video',
                  })
                }
              >
                <Icon name={videoSVG} size="24px" />
              </Button>
            </Button.Group>
            {tiles.customTiles.length !== 0 && (
              <React.Fragment>
                <div className="separator" />
                <Button.Group>
                  <Button icon basic onClick={this.openCustomTileMenu}>
                    <Icon name={TemplatedTilesSVG} size="24px" />
                  </Button>
                </Button.Group>
              </React.Fragment>
            )}
          </div>
        )}
        {this.state.addNewTileOpened && this.state.customTilesOpened && (
          <div className="add-tile toolbar">
            {tiles.customTiles.map(tile => (
              <Button.Group key={tile.title}>
                <Button
                  icon
                  basic
                  onClick={() =>
                    this.props.onMutateTile(this.props.tile, {
                      '@type': tile.title,
                    })
                  }
                >
                  <Icon name={tile.icon} size="24px" />
                </Button>
              </Button.Group>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(Edit);
