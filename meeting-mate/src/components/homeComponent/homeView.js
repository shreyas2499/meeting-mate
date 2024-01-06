import React from 'react';
import EventView from '../eventViewComponent/EventView';
import CustomNavbarView from "../customNavbarComponent/customNavbarView"

export default function HomeView() {
    return (
        <>
            <div className="App">
                <CustomNavbarView />
                <main style={{"minHeight": "80vh", "overflowY": "auto"}}>
                    <EventView />
                </main>
                <footer>
                    <p>© 2024 Meeting Mate</p>
                </footer>
            </div>
        </>

    )
}