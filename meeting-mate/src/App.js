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
