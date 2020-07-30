import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { ReactQueryDevtools } from 'react-query-devtools';
import { useQuery } from 'react-query';
import List from './components/List';
import { useLocalStorage } from './functions/useLocalStorage';
import Footer from './components/Footer';

const getVideos = async (key, country, pageToken) => {  
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&regionCode=${country.lang}&pageToken=${pageToken}`)
  return res.json();
}

function App() {

  // hardcode country list
  const countryList = [
    {
      name: "Malaysia",
      lang: "MY"
    },
    {
      name: "Singapore",
      lang: "SG"
    },
    {
      name: "United States",
      lang: "US"
    },
  ];

  // Change country - index
  const change = (index) => {
    setCurrentIndex(index);
  }


  // current index 
  const [currentIndex, setCurrentIndex] = useState(0);

  // page token
  const [pageToken, setPageToken] = useLocalStorage('pageToken', "");

  // current selected country
  const [country, setCountry] = useState(country => ({
    ...country,
    name: countryList[currentIndex].name,
    lang: countryList[currentIndex].lang
  }));

  // const [keyword, setKeyword] = useState("");

  // Fetching
  const { data, status, isLoading } = useQuery(['videos', country, pageToken], getVideos);
  

  window.onscroll = () => {
    // Get the navbar
    let navbar = document.getElementById("sticky-button-navbar");

    if(navbar === null || navbar === undefined)
      return;

    // Get the offset position of the navbar
    let sticky = 50;

    if (window.pageYOffset >= sticky) {
      navbar.classList.add("button-sticky-container")
    } else {
      navbar.classList.remove("button-sticky-container");
    }
  }

  useEffect(() => {

    if(country.name !== countryList[currentIndex].name)
      setPageToken("");
    
    setCountry((country) => ({
      ...country,
      name: countryList[currentIndex].name,
      lang: countryList[currentIndex].lang
    }))          
    
    window.scrollTo({ top: 0 })   

  }, [currentIndex])

  useEffect(() => {
    window.scrollTo({ top: 0 })    
  }, [pageToken])

  console.log(status)

  return (
    <div className="App">
      <div className="container py-5">

        <h2 className="text-center mt-3">🔥 Most popular video in <span className="country-highlight">#{country.name}</span></h2>

        {isLoading && <div>
          <h5>Is loading ...</h5>
        </div>}
        {status === 'error' && <div>
          <h5>Something went wrong ...</h5>
        </div>}                
                
        {data && (
          <>
            <div style={{height: "70px"}}>
              <div id="sticky-button-navbar" className="d-flex justify-content-end mt-5">
                {countryList.map((item, index) => (
                  <>
                    <h4 key={index} className="mb-0 clickable" onClick={() => change(index)} ><span className={`mr-2 p-3 badge ${country.name === item.name ? 'bg-primary' : 'bg-light text-muted'}`}>{item.name}</span></h4>
                  </>
                ))}
              </div>
            </div>
            <List data={data} />
            <div className="my-4 page-button-container d-flex justify-content-center">
              {data.prevPageToken && data.nextPageToken && <button onClick={() => setPageToken("")} className="btn btn-secondary mr-2">Default</button>}
              {data.prevPageToken && <button onClick={() => setPageToken(data.prevPageToken)} className="btn btn-secondary mr-2">Prev</button>}
              {data.nextPageToken && <button onClick={() => setPageToken(data.nextPageToken)} className="btn btn-secondary">Next</button>}
            </div>
          </>
        )}
        <Footer />
      </div>
      <ReactQueryDevtools />      
    </div>
  );
}

export default App;
