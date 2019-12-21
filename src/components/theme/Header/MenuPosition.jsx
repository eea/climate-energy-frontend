
import React, { useState, useRef } from 'react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position'


function MenuPosition(Props) {

  const [elementPosition, setElementPosition] = useState({ x: 20, y: 150 })
  const firstLevel = useRef()

  // Element scroll position
  useScrollPosition(
    ({ currPos }) => {
      setElementPosition(currPos)
    }, [], firstLevel
  )

  console.log({ elementPosition })

  return (
    <div
      ref={firstLevel}
      className="menuWrapper"
      style={{top: elementPosition.y}}
    >
      {Props.children}
    </div>
  )
};

export default MenuPosition