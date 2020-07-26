import React from 'react';
import ArticleRow from './articleRow';

const DataTable = (props) => {
    const {headers, displayNews, upVote, hideArticle} = props;
    return (
        <table className="news-table" cellSpacing="0" cellPadding="0">
            <thead>
                <tr>
                    {headers.map((header, index) => <th key={index}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {
                    displayNews.map(article => <ArticleRow 
                        key={article.objectID}
                        article={article} upVote={upVote} hideArticle={hideArticle} />)
                }
            </tbody>
        </table>
    )
}

export default DataTable;