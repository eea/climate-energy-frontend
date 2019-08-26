import React from 'react';

function HeaderImage(props) {
    return (
        <div className="header-image" style={{backgroundImage: `url(${props.url})`}}>
            {props.children}
        </div>
        )
}

export default HeaderImage