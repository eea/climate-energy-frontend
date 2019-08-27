/**
 * Navigation reducer.
 * @module reducers/frontpage_slides
 */

import { map } from 'lodash';
import { settings } from '~/config';

import { SET_FOLDER_HEADER } from '~/constants/ActionTypes';

const initialState = {
  error: null,
  items: {},
  loaded: false,
  loading: false,
};

/**
 * Navigation reducer.
 * @function navigation
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function folder_header(state = initialState, action = {}) {
    if(action.type === SET_FOLDER_HEADER) {
        const oldVal = state.items ? state.items : {}
        return {
            ...state,
            error: null,
            items: {
                ...oldVal,
                ...action.payload
            },
            loaded: true,
            loading: false,
        };
    }
    return state
}