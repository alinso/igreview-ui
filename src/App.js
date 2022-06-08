import './App.css';

import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./component/page/Landing";

class App extends Component {

    render() {


        return (
                <Router>
                    <div className="App">

                    <Routes>
                        {<Route exact path="/" element={<Landing/>}/>}
                    </Routes>
                    </div>

                </Router>

        );
    }
}

export default App;

