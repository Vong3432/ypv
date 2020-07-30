import React from 'react'
import Video from './Video'

const List = ({ data }) => {  
          
    return (
        <div className="video-list-container">
            { data.items.map((item, index) => <Video key={index} video={item} /> )}
        </div>
    )
}

export default List
