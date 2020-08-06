import React, { useState } from 'react'
import { useQuery } from 'react-query';
import Image from '../components/Image';

const getChannelInfo = async(key, id) => {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&fields=items&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`)
    return res.json();
}

const Video = ({ video }) => {

    const {
        channelId,
        channelTitle,
        title,
        description,
        publishedAt,
        tags,
        thumbnails
    } = video.snippet;    

    const [showDesc, setShowDesc] = useState(false);        

    const { data, isLoading, status } = useQuery(['channel', channelId], getChannelInfo);        

    return (
        <div className="video-item-div">                                 

            <a href={`https://www.youtube.com/watch?v=${video.id}`}>
                <img src={thumbnails.high.url} alt={title} />
            </a>            
            <div className="video-item-content">
                <h5 className="video-title">{title}</h5>                                
            </div>
            <a href={`http://www.youtube.com/channel/${channelId}`} className="channel-info">
                { data ? <Image src={data.items[0].snippet.thumbnails.default.url} /> : <div className="img-place-holder"></div>}
                <h6 className="channel-title">{channelTitle}</h6>    
            </a>               
        </div>
    )
}

export default Video
