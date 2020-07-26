import React, { Component } from 'react';
import { openDB } from 'idb';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { withRouter } from 'react-router-dom';
import { DataTable } from './../../components';
import ClipLoader from "react-spinners/ClipLoader";
import './news.css';

export class News extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: {
                length: 10,
                number: this.props.match ? ~~this.props.match.params.page : 1
            },
            newsArticles: [],
            displayNews: [],
            loading: true
        }
        this.upVote = this.upVote.bind(this);
        this.hideArticle = this.hideArticle.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        // this.loadData = this.loadData.bind(this);
        // this.loadData();
    }

    componentDidMount() {
        openDB('news', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                db.createObjectStore('articles');
            }
        }).then(db => {
            db.get('articles', 'hits')
                .then((data) => {
                    if (data) {
                        this.setState({
                            newsArticles: data,
                            loading: false
                        })
                    }
                    else {
                        axios.get('https://hn.algolia.com/api/v1/search')
                            .then((response) => {
                                const updatedPointsArray = response.data.hits.map(value => ({
                                    ...value,
                                    points: Math.round(Math.random() * 25),
                                    objectID: Math.round(Math.random() * 10000).toString(),
                                }))
                                const fillArray = this.fillArray(updatedPointsArray)
                                db.put('articles', fillArray, 'hits');
                                this.setState({
                                    newsArticles: fillArray,
                                    loading: false
                                })
                            })
                    }
                })
        })
    }


    fillArray(array) {
        let arr = [];
        array.forEach((item) => {
            arr = [...arr, ...array]
        })
        return arr;
    }

    upVote(record) {
        const newsArticles = this.state.newsArticles.map(article => {
            if (article.objectID === record) {
                return {
                    ...article,
                    points: article.points + 1
                }
            }
            return article
        });
        this.setState({ newsArticles }, () => {
            openDB('news', 1, {
                upgrade(db, oldVersion, newVersion, transaction) {
                    db.createObjectStore('articles');
                }
            }).then((db) => {
                db.put('articles', newsArticles, 'hits');
            })
                .catch(e => console.log(e))
        })
    }

    hideArticle(record) {
        const newsArticles = this.state.newsArticles
        const articleIndex = newsArticles.findIndex(article => article.objectID === record);
        newsArticles.splice(articleIndex, 1);
        this.setState({
            newsArticles
        }, () => {
            openDB('news', 1, {
                upgrade(db, oldVersion, newVersion, transaction) {
                    db.createObjectStore('articles');
                }
            })
                .then((db) => {
                    db.put('articles', this.state.newsArticles, 'hits')
                })
                .catch(e => console.log(e))
        })
    }

    prev() {
        this.setState(prevState => ({
            page: {
                ...prevState.page,
                number: prevState.page.number - 1
            }
        }), () => {
            this.props.history.push(`/${this.state.page.number}`)
        })
    }

    next() {
        this.setState(prevState => ({
            page: {
                ...prevState.page,
                number: prevState.page.number + 1
            }
        }), () => {
            this.props.history.push(`/${this.state.page.number}`)
        })
    }

    goto(pageNumber) {
        this.setState({
            page: {
                ...this.state.page,
                number: pageNumber
            }
        }, () => this.props.history.push(`/${pageNumber}`))
    }


    render() {
        const { newsArticles, page: { length, number }, loading } = this.state;
        const startIndex = length * number - 10, endIndex = length;
        const allNews = newsArticles ? [...newsArticles] : [];
        const displayNews = allNews.splice(startIndex, endIndex);
        const totalPages = [...Array(Math.ceil(newsArticles.length / length)).keys()].map(i => i + 1);
        const displayPages = number > 2 ? totalPages.slice(number - 3, number + 2) : totalPages.slice(0, 5)
        let labels = [], pointsData = []
        for (let article in newsArticles) {
            if (article === 50) {
                break;
            }
            labels.push(newsArticles[article].objectID)
            pointsData.push(newsArticles[article].points)
        }
        const data = {
            labels,
            datasets: [
                {
                    label: 'Votes',
                    fill: false,
                    lineTension: 0,

                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: pointsData
                }
            ]
        }

        const headers = ['Comments', 'Vote Count', 'Upvote', 'News Details'];
        if (loading) {
            return (
                <div className="loader">
                    <ClipLoader
                        size={100}
                        color={"#ff6600"}
                        loading={true}
                    />
                </div>
            )
        }
        return (
            <>
                <div className="container">
                    <DataTable
                        headers={headers}
                        displayNews={displayNews}
                        upVote={this.upVote}
                        hideArticle={this.hideArticle} />
                    <div className="pagination">
                        <div className="table-record">
                            <span>Showing {number * 10 - 9} - {number * 10} / {newsArticles.length}</span>
                        </div>
                        <div className="pagination-buttons">
                            <button className="prev"
                                disabled={number === 1} onClick={this.prev}>Previous</button>
                            {
                                displayPages.map(page => <span key={page} onClick={() => this.goto(page)} className={`page-number ${number === page ? 'active' : ''}`}>{page}</span>)
                            }
                            <button className="next"
                                disabled={newsArticles.length - (number * length) <= 0} onClick={this.next}>Next</button>
                        </div>
                    </div>

                </div>
                <Line data={data} height={100} />
            </>
        )
    }
}

export default withRouter(News)