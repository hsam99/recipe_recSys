import React from "react";
import ReactDOM from 'react-dom';
import HomePage from './pages/HomePage';

const App = () => {
    const text = 'Hello World';
    
    return (
      <div className="App">
        <HomePage />
      </div>
    );
}

export default App

ReactDOM.render(
    <App />,
    document.getElementById('app')
);