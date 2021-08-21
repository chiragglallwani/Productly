import React from 'react'
import Header from './components/Header'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from './components/Login';
import Home from './components/Home';

function App() {
    
    return (
        <Router>
            <div className="app">

                <Switch>
                <Route path="/" exact>
                <Login 
                
                />
            </Route>
            <Route path="/home">
                <Header/>
                <Home/>
            </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
