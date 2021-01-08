import React from 'react'
import Video from './Video'

const List = ({ pages, data }) => {   
    
    console.log(pages)

    return (
        <>
            <div className="video-list-container">
                {pages.map((page, index) => (
                    <React.Fragment key={index}>
                    { page.items.map((item, index) => <Video key={index} video={item} />) }
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

export default List
