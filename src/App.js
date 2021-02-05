import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.scss';
import { ReactQueryDevtools } from 'react-query-devtools';
import { useInfiniteQuery, QueryClient, QueryClientProvider } from 'react-query';
import List from './components/List';
import { useLocalStorage } from './functions/useLocalStorage';
import Footer from './components/Footer';
import useIntersectionObserver from './functions/useIntersectionObserver';
// import { Helmet } from 'react-helmet';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

function App() {  

  // const [keyword, setKeyword] = useState("");

  // Fetching
  // const { data, status, isLoading } = useQuery(['videos', country, pageToken], getVideos);


  window.onscroll = () => {
    // Get the navbar
    let navbar = document.getElementById("sticky-button-navbar");

    if (navbar === null || navbar === undefined)
      return;

    // Get the offset position of the navbar
    let sticky = 50;

    if (window.pageYOffset >= sticky) {
      navbar.classList.add("button-sticky-container")
    } else {
      navbar.classList.remove("button-sticky-container");
    }
  }



  // useEffect(() => {
  //   window.scrollTo({ top: 0 })
  // }, [pageToken])

  // if (isLoading)
  //   return <h5>Is loading ...</h5>

  // if (status === 'error')
  //   return <h5>Something went wrong ... Please refresh page</h5>

  return (
    <div className="App">
      
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </div>
  );
}

const getVideos = async (country, pageToken) => {

  console.log(country, pageToken);
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&regionCode=${country.lang}&pageToken=${pageToken}`)
  const json = await res.json();

  return json;
}

function Main() {

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


  useEffect(() => {

    console.log('refresh')

    // if (country.name !== countryList[currentIndex].name)        
    setPageToken("");

    setCountry((country) => ({
      ...country,
      name: countryList[currentIndex].name,
      lang: countryList[currentIndex].lang
    }))

    window.scrollTo({ top: 0 })

  }, [currentIndex])

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ['videos', country],
    async ({ pageParam = "" }) => {
      return getVideos(country, pageParam);
    },
    {
      getNextPageParam: lastPage => {
        return lastPage.nextPageToken ?? false
      },
    }
  )

  const loadMoreRef = useRef(null);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  })

  return (
    <>
      <div className="main-container container py-5">

        {status === 'loading' ? (
          <div
            className="text-white w-100 text-center pt-5"
          >
            <h5>Loading ...</h5>
          </div>

        ) : status === 'error' ? (
          <div
            className="text-white w-100 text-center pt-5"
          >
            <h5>Something went wrong ... Please refresh page</h5>
          </div>          
        ) : (
              <>
                <h2 style={{ color: 'white' }} className="text-center mt-3">🔥 Most popular video in <span className="country-highlight">#{country.name}</span></h2>

                <div style={{ height: "70px" }}>
                  <div id="sticky-button-navbar" className="d-flex justify-content-end mt-5">
                    {countryList.map((item, index) => (
                      <>
                        <h4 key={index} className="mb-0 clickable" onClick={() => change(index)} ><span className={`mr-2 p-3 badge ${country.name === item.name ? 'bg-primary' : 'bg-dark-purple text-muted'}`}>{item.name}</span></h4>
                      </>
                    ))}
                  </div>
                </div>

                {/* {isFetchingNextPage
                  ? <h5>Loading more ...</h5>
                  : !hasNextPage && <h5>Nothing more to load</h5>
                } */}

                <List pages={data.pages} data={data} />
                {/* <div className="my-4 page-button-container d-flex justify-content-center">
                  {data.prevPageToken && data.nextPageToken && <button onClick={() => setPageToken("")} className="btn btn-secondary mr-2">Default</button>}
                  {data.prevPageToken && <button onClick={() => setPageToken(data.prevPageToken)} className="btn btn-secondary mr-2">Prev</button>}
                  {data.nextPageToken && <button onClick={() => setPageToken(data.nextPageToken)} className="btn btn-secondary">Next</button>}
                </div> */}


              </>
            )}

        <div
          ref={loadMoreRef}
          className="text-white w-100 text-center pt-5"
        >
          {isFetchingNextPage
            ? <h5>Loading more ...</h5>
            : hasNextPage
              ? <h5>Load newer ...</h5>
              : <h5>Nothing more to load</h5>
          }
        </div>

      </div>

      <Footer />
      <ReactQueryDevtools />
    </>
  )
}

export default App;
