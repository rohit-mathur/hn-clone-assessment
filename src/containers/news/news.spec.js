import React from 'react';
import { shallow, mount } from 'enzyme';
import {News, ArticleRow} from './news';
import { BrowserRouter } from 'react-router-dom';

describe('Test',() => {
    const article = [
        {
            objectID:1,
            num_comments:34,
            points:435,
            title:'test',
            url:'https://www.test.com',
            author:'Me',
            created_at: new Date()
        },
        {
            objectID:2,
            num_comments:34,
            points:435,
            title:'test',
            url:'https://www.test.com',
            author:'Me',
            created_at: new Date()
        }
    ]
    it('Should render component without crashing', () => {
        shallow(<BrowserRouter><News /></BrowserRouter>)
    })
    it('Should render news', () => {
        const component = mount(<ArticleRow article={article} />)      
        // expect(component.find('.articles-row')).to.have.lengthOf(2);
    })
    
})