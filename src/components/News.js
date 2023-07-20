import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
     const [articles, setArticles] = useState([])
     const [loading, setLoading] = useState(true)
     const [page, setPage] = useState(1)
     const [totalResults, setTotalResults] = useState(0)

     const capitalizeFirstLetter = (string) => {
          return string.charAt(0).toUpperCase() + string.slice(1);
     }
     //      document.title = `${capitalizeFirstLetter(props.category)} - SKNews`;

     const updateNews = async () => {
          props.setProgress(10)
          let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
          setLoading(true)
          let data = await fetch(url);
          props.setProgress(40)
          let parsedData = await data.json();
          props.setProgress(70)
          setArticles(parsedData.articles)
          setTotalResults(parsedData.totalResults)
          setLoading(false);
          props.setProgress(100)
     }
     useEffect(() => {
          document.title = `${capitalizeFirstLetter(props.category)} - SKNews`;
          updateNews();
          // eslint-disable-next-line
     }, [])

     const fetchMoreData = async () => {
          setPage(page + 1)
          let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
          let data = await fetch(url);
          let parsedData = await data.json();
          setArticles(articles.concat(parsedData.articles))
          setTotalResults(parsedData.totalResults)
     };

     return (
          <>
               <h2 className='text-center' style={{ margin: "25px" }}>SKNews - Top {capitalizeFirstLetter(props.category)} Headlines</h2>
               {loading && <Spinner />}
               <InfiniteScroll
                    dataLength={articles?.length}
                    next={fetchMoreData}
                    hasMore={articles?.length !== totalResults}
                    loader={!loading && <Spinner />}
               >
                    <div className="container">
                         <div className="row">
                              {articles?.map((element) => {
                                   return <div className="col-md-4" key={element.url}>
                                        <NewsItem title={element.title ? element.title : ""} discription={element.description ? element.description : ""} imageURl={element.urlToImage} newsUrl={element.url} author={element.author} publishedAt={element.publishedAt} source={element.source.name} />
                                   </div>
                              })}
                         </div>
                    </div>
               </InfiniteScroll>
          </>
     )
}
News.defaultProps = {
     pageSize: 8,
     country: 'us',
     category: "general"
}
News.propTypes = {
     pageSize: PropTypes.number,
     country: PropTypes.string,
     category: PropTypes.string
}

export default News;
