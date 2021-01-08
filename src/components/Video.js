import React, { useState } from 'react'
import { useQuery } from 'react-query';
import Image from '../components/Image';

const getChannelInfo = async(key, id) => {    
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${key.queryKey[1]}&fields=items&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`)    
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

            <a target="_blank" href={`https://www.youtube.com/watch?v=${video.id}`}>
                <div className="video-thumbnail-wrapper">
                    <img className="video-thumbnail" src={thumbnails.high.url} alt={title} />
                </div>                
            </a>            
            <div className="video-item-content">
                <h5 className="video-title">{title}</h5>                                
                <a href={`http://www.youtube.com/channel/${channelId}`} className="channel-info">
                { status === 'loading' ? <div className="img-place-holder"></div> : <Image src={data.items[0].snippet.thumbnails.default.url} />}
                <h6 className="channel-title">{channelTitle}</h6>    
            </a>   
            </div>                        
        </div>
    )
}

export default Video
