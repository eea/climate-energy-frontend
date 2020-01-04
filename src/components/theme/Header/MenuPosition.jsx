import React, { useState, useRef } from 'react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

function shouldPaddingUpdate(
  expanded,
  current,
  initial,
  setCurrentTop,
  currentTopDistance,
) {
  console.log(
    'expanded',
    expanded,
    'current',
    current,
    'initial',
    initial,
    // 'setCurrentTop',
    // setCurrentTop,
  );

  if (expanded && current === null && initial === 300) {
    return initial;
  }
  if (expanded) {
    if (currentTopDistance !== current) {
      setCurrentTop(current);
    }
    return current;
  }
}

function MenuPosition(props) {
  const [elementPosition, setElementPosition] = useState({ x: 0, y: null });
  const firstLevel = useRef();

  useScrollPosition(
    ({ currPos }) => {
      setElementPosition(currPos);
    },
    [],
    firstLevel,
  );

  return (
    <div
      ref={firstLevel}
      className={props.className}
      style={{
        paddingTop: shouldPaddingUpdate(
          props.expanded,
          elementPosition.y,
          props.topDistance,
          props.setCurrentTop,
          props.currentTopDistance,
        ),
      }}
    >
      {props.children}
    </div>
  );
}

export default MenuPosition;
