import React from 'react';
import { Navbar, Nav, NavbarToggler } from 'reactstrap';
import { MdEmail } from "react-icons/md";
import "./customNavbarView.css"
import { logoutEndpoint } from "../../allEndPoints/router"

function CustomNavbarView() {
    function logoutContent() {
        if (localStorage.getItem("token")) {
            return "Log out"
        }
        else {
            return ""
        }
    }

    const handleLogout = (event) => {
        if (localStorage.getItem("token")) {
            event.preventDefault()
            localStorage.clear();
            fetch(logoutEndpoint, { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    console.log(data, "data")
                    window.location.reload();
                })
        }
        else {
            window.alert("Please login")
        }
    }

    return (
        <>
            <Navbar color='dark' bg="dark" variant="dark" expand="lg">
                <a className="links" href="/" style={{ cursor: "pointer", color: "white" }}><MdEmail style={{"width":"30px", "height":"25px"}}/> Meeting Mate</a>

                <NavbarToggler aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                    <a className="links" style={{ cursor: "pointer", color: "white" }} href="/" >Home</a>
                </Nav>
                <Nav className="ml-auto">
                    <a className="links" onClick={(e) => { handleLogout(e) }} style={{ cursor: "pointer", color: "white" }}>{logoutContent()}</a>
                </Nav>
            </Navbar>
        </>
    );
}

export default CustomNavbarView;



