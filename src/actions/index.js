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
  GET_FRONTPAGESLIDES,
  SET_FOLDER_HEADER, 
  GET_FOLDER_HEADER
} from '~/constants/ActionTypes';

export function getFrontpageSlides() {
    return {
      type: GET_FRONTPAGESLIDES,
      request: {
        op: 'get',
        path: `/frontpage_slides?fullobjects`,
      },
    };
}



export function setFolderHeader({url, title, description}) {
  return {
    type: SET_FOLDER_HEADER,
    payload: {
      url, title, description
    }
  };
}




export function getFolderHeader() {
  return {
    type: GET_FOLDER_HEADER,
    request: {
      op: 'get',
      path: `/frontpage_slides?fullobjects`,
    },
  };
}

