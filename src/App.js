import React from 'react';
import ExtensionRouter from './components/ExtensionRouter'
import Welcome from './components/Welcome'
import Msg from './components/Msg'

import './App.css';

function App() {
    return (
        <div className="App">
            <ExtensionRouter
                root={<Welcome />}
                msg={<Msg />}
            />
        </div>
    );
}

export default App;
