import React from 'react';

const ArticleRow = ({ article, upVote, hideArticle }) => {
        return (
            <tr className="article-row">
                <td>{article.num_comments}</td>
                <td>{article.points}</td>
                <td className="text-center">
                    <i onClick={() => upVote(article.objectID)} className="fa fa-sort-asc" />
                </td>
                <td>
                    {article.title}
                    <span className="details-text">
                        <span className="color-light">({article.url}) by </span>
                        <span className="color-dark">{article.author} </span>
                        <span className="color-light">{article.created_at} </span>
                        <span className="color-dark" onClick={() => hideArticle(article.objectID)}>[ hide ]</span>
                    </span>
                </td>
            </tr>
        )
}

export default ArticleRow;