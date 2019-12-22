
import React, { useState, useRef, useEffect } from 'react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position'


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function shouldPaddingUpdate (expanded, current, y, setTopDistance) {
  if(current == undefined || y == undefined) {
    return 0
  } 
  // console.log('prev', y)
  if(expanded && current === y) {
    return current
  }
  if(expanded && current !== y) {
    return y
  }
  if(!expanded && current !== y) {
    setTopDistance(current)
  }
}

function MenuPosition(props) {

  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 })
  const firstLevel = useRef()

  useScrollPosition(
    ({ currPos }) => {
      setElementPosition(currPos)
    }, [], firstLevel
  )

  return (
    <div
      ref={firstLevel}
      className={props.className}
      style={{paddingTop: shouldPaddingUpdate(props.expanded, elementPosition.y, props.topDistance, props.setTopDistance)}}
    >
      {props.children}
    </div>
  )
};

export default MenuPosition