import React from 'react';
import { shallow } from 'enzyme';
import { News } from './news';
import ArticleRow from './../../components/dataTable/articleRow';
import { BrowserRouter } from 'react-router-dom';

describe('Test', () => {
    const article = {
        objectID: 1,
        num_comments: 34,
        points: 435,
        title: 'test',
        url: 'https://www.test.com',
        author: 'Me',
        created_at: new Date()
    }
    it('Should render component without crashing', () => {
        shallow(<BrowserRouter><News /></BrowserRouter>)
    })
    it('Should render news', () => {
        const component = shallow(<ArticleRow article={article} />)
        expect(component.find('.article-row').length).toBe(1)
    })
})