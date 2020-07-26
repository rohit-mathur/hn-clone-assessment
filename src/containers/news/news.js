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
                                db.put('articles', response.data.hits, 'hits');
                                this.setState({
                                    newsArticles: response.data.hits,
                                    loading: false
                                })
                            })
                    }
                })
        })
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


    render() {
        const { newsArticles, page: { length, number }, loading } = this.state;

        const allNews = newsArticles ? [...newsArticles] : [];
        const displayNews = allNews.splice(length * number - 10, length * number)

        const data = {
            labels: newsArticles.map(article => article.objectID),
            datasets: [
                {
                    label: 'Votes',
                    fill: false,
                    lineTension: 0,

                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: newsArticles.map(article => article.points)
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

                    <div className="pagination-buttons">
                        <button
                            disabled={number === 1} onClick={this.prev}>Previous</button>
                        <button
                            disabled={newsArticles.length - (number * length) <= 0} onClick={this.next}>Next</button>
                    </div>

                </div>
                <Line data={data} height={150} />
            </>
        )
    }
}

export default withRouter(News)