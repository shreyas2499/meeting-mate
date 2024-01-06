import { Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import HomeView from "./components/homeComponent/homeView";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeView />} />
            </Routes>
        </>
    );
}

export default App;


//Client ID:  584206551589-1m6q9qtm83kftpleeo5g8g9tupvcb84d.apps.googleusercontent.com
// Client Secret: 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



// Calender
// API Key: AIzaSyBG1HkyvKdu4ocSljB8-9iuh9nlSAhVy4w


// Working with google authentication: https://www.youtube.com/watch?v=UUJfTsn6S_Y
