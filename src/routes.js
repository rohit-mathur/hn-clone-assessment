import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import News from './containers/news/news';

class Routes extends React.Component{
    render(){
        return(
            
                <Switch>
                    <Route exact path="/:page" component={News} />
                    <Redirect from="/" to="/1" />
                </Switch>
            
        )
    }
}

export default Routes;