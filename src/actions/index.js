/**
 * Add your actions here.
 * @module actions
 * @example
 * import {
 *   searchContent,
 * } from './search/search';
 *
 * export {
 *   searchContent,
 * };
 */

import {
  SET_FOLDER_HEADER,
  SET_FOLDER_TABS,
  GET_PARENT_FOLDER_DATA,
} from '~/constants/ActionTypes';

export function setFolderHeader(payload) {
  const actualPayload = {};
  for (const key in payload) {
    if (payload[key] !== null && payload[key] !== undefined) {
      actualPayload[key] = payload[key];
    }
  }

  if (Object.keys(actualPayload)) {
    return {
      type: SET_FOLDER_HEADER,
      payload: actualPayload,
    };
  }
  return;
}

export function setFolderTabs(payload) {
    console.log('in action', 'setting folder tabs', payload)
  return {
    type: SET_FOLDER_TABS,
    payload: payload,
  };
}

export function getParentFolderData(url) {
console.log('in action', 'getparentfolderdata', url)

  return {
    type: GET_PARENT_FOLDER_DATA,
    request: {
      op: 'get',
      path: `/${url}?fullobjects`,
    },
  };
}
