import React, { useState, useEffect } from 'react';
import { Button, Table } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getEventsEndpoint, sendEmailEndpoint } from "../../allEndPoints/router"
import "./EventView.css"

export default function MapView() {
    const [events, setEvents] = useState([]);
    const [userInfo, setUserInfo] = useState({})
    
    useEffect(() => {
        if (events && events.length == 0) {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo")))
            setEvents(JSON.parse(localStorage.getItem("events")))
        }
    })

    function getEvents() {
        fetch(getEventsEndpoint)
            .then(response => response.json())
            .then(data => {
                console.log(data, "data")
                setUserInfo(data["user"])
                setEvents(data["data"])

                localStorage.setItem("events", JSON.stringify(data["data"]))
                localStorage.setItem("userInfo", JSON.stringify(data["user"]))
                localStorage.setItem("token", data['user'].token)
                localStorage.setItem("email", data['user'].email)
                window.location.reload()
            })
    }

    function getAttende(event) {
        let attendesList = event.attendees
        let name = ""
        attendesList.map(attend => {
            if (attend.email != localStorage.getItem("email")) {
                name = attend.email
            }
            else {
                //pass
            }
        })
        return name
    }


    function getLocation(event) {
        return event.location
    }

    function getStartTime(event) {
        var inputDate = new Date(event.start.dateTime);

        var formattedDate =
            ('0' + (inputDate.getMonth() + 1)).slice(-2) + '/' +
            ('0' + inputDate.getDate()).slice(-2) + '/' +
            ('' + inputDate.getFullYear()).slice(-2) + ' ' +
            ('0' + inputDate.getHours()).slice(-2) + ':' +
            ('0' + inputDate.getMinutes()).slice(-2) + ':' +
            ('0' + inputDate.getSeconds()).slice(-2);

        return formattedDate
    }

    function getEndTime(event) {
        var inputDate = new Date(event.end.dateTime);

        var formattedDate =
            ('0' + (inputDate.getMonth() + 1)).slice(-2) + '/' +
            ('0' + inputDate.getDate()).slice(-2) + '/' +
            ('' + inputDate.getFullYear()).slice(-2) + ' ' +
            ('0' + inputDate.getHours()).slice(-2) + ':' +
            ('0' + inputDate.getMinutes()).slice(-2) + ':' +
            ('0' + inputDate.getSeconds()).slice(-2);

        return formattedDate
    }

    function getMeetingLink(event) {

        var extractedLinks = ""
        let message = ""


        if ("hangoutLink" in event) {
            return event["hangoutLink"]
        }
        else if (event.description && event.description.includes("teams.microsoft.com")) {
            message = event.description
            const urlRegex = /<([^>]+)>/g;

            extractedLinks = message.match(urlRegex)[0];
            var modifiedString = extractedLinks.substring(1, extractedLinks.length - 1);

            return modifiedString
        }
    }


    function remindCandidate(event) {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                "email": getAttende(event),
                "dateTime": getStartTime(event).toString(),
                "link": getMeetingLink(event),
                "loggedUser": localStorage.getItem("email")
            })
        }

        fetch(sendEmailEndpoint, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data, "after sending email")
                window.alert("Email sent")
            });
    }

    return (
        <>
            <Button color="success" style={{ "marginTop": "10px", "marginBottom": "10px" }} onClick={() => { getEvents() }}> Get your events</Button>

            {localStorage.getItem("token") ?
                <Table bordered hover striped style={{ "width": "80%", "margin": "auto" }}>
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>
                                Attendee
                            </th>
                            <th>
                                Location
                            </th>
                            <th>
                                Start Date/Time
                            </th>
                            <th>
                                End Date/Time
                            </th>
                            <th>
                                Meeting Link
                            </th>
                            <th>
                                Send Reminder
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr scope="row">
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    {getAttende(event)}
                                </td>
                                <td>
                                    {getLocation(event)}
                                </td>
                                <td>
                                    {getStartTime(event)}
                                </td>
                                <td>
                                    {getEndTime(event)}
                                </td>
                                <td>
                                    <a href={getMeetingLink(event)}>Join Meeting</a>
                                </td>
                                <td>
                                    <Button color="success" onClick={() => remindCandidate(event)}>Remind</Button>
                                </td>
                            </tr>


                        ))}
                    </tbody>
                </Table>
                :
                <></>
            }
        </>
    )
}

