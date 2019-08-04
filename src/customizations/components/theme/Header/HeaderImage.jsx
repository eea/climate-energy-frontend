import React from 'react';

function HeaderImage(props) {  
    return (
        <div className="header-image">
            <img src={props.url} />
        </div>
        )
}

export default HeaderImage