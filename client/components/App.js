import React, {Component} from 'react'
import { HashRouter as Router, Route } from 'react-router-dom';
import Visualizer from './Visualizer'
import LaunchPage from './LaunchPage'

export default class App extends Component {

    render() {

        return(
            <Router>
                <main>
                    <Route path="/" exact component = {LaunchPage}/>
                    <Route path="/schema/:schemaId" exact component = {Visualizer}/>
                </main>



            </Router>

        )

    }


}