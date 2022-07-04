import React, { useEffect, useState } from 'react';
import './App.css';
import TempData from './TemporaryData'

interface NavProps {
    isLoggedIn: boolean,
    canCreateEvents: boolean
}

function MainNavigation(props: NavProps) {
    const loggedInLinks = [
        {name: "Hosting Events", link: "/events/submitted"},
        {name: "Attending Events", link: "/events/attending"}
    ]

    return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#navbar"
                            aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a href="/" className="navbar-brand">Dallas Makerspace Calendar</a>
                </div>
                <div id="navbar" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        {(props.isLoggedIn && props.canCreateEvents)
                            ? <li><a href="/users/login?redirect=%2Fevents%2Fadd">Submit Event</a></li>
                            : false}
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        {props.isLoggedIn
                            ? loggedInLinks.map(link => <li key={link.name}><a href={link.link}>{link.name}</a></li>)
                            : false}
                        {props.isLoggedIn
                            ? <li><a href="/users/logout">Logout</a></li>
                            : <li><a href="/users/login">Login</a></li>}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

function EventsKioskClock() {
    const clockOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    const [state, setState] = useState({
        time: new Date()
    })


    useEffect(() => {
        const interval = setInterval(() => {
            setState({time: new Date()})
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <div id="kiosk-clock" style={{float: "left", fontSize: "30px"}}>
        {state.time.toLocaleDateString('en-US', clockOptions)}
    </div>
}

function EventsEventLine(props: { eventDetails: EventDetails }) {
    const timeFormat: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
        hourCycle: "h12"
    }

    const eventDetails = props.eventDetails;

    return <div className="panel event-panel panel-default">
        <div className="panel-heading" role="tab" id={"heading-" + eventDetails.uuid}>
            <a role="button" data-toggle="collapse" data-parent="#accordion"
               href={"#collapse-" + eventDetails.uuid}
               aria-expanded="false" aria-controls={"collapse-" + eventDetails.uuid} className="collapsed">
                <h4 className="panel-title"><span
                    className="time">{eventDetails.startDate.toLocaleTimeString('en-US', timeFormat)}</span>
                    {eventDetails.availableSpots <= 0 ? <strong>FULL: </strong> : false}
                    {eventDetails.name}</h4>
            </a>
        </div>
        <div id={"collapse-" + eventDetails.uuid} className="panel-collapse collapse" role="tabpanel"
             aria-labelledby={"heading-" + eventDetails.uuid}>
            <div className="panel-body">
                <table className="table table-condensed">
                    <tbody>
                    <tr>
                        <td><strong>When</strong></td>
                        <td>
                            Tue Jun 14 7pm — 9pm
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Where</strong></td>
                        <td>
                            {eventDetails.location.room}<br/>
                            {eventDetails.location.address}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Details</strong></td>
                        <td>{eventDetails.shortDescription}</td>
                    </tr>
                    <tr>
                        <td><strong>Host</strong></td>
                        <td>{eventDetails.host}</td>
                    </tr>
                    <tr>
                        <td><strong>Cost</strong></td>
                        <td>${eventDetails.cost.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <a href={"/events/view/" + eventDetails.uuid}>More Info and RSVP »</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

interface EventDetails {
    uuid: string,
    startDate: Date,
    endDate: Date,
    name: string,
    totalSpots: number
    availableSpots: number,
    host: string,
    cost: number,
    shortDescription: string,
    longDescription: string,
    location: {
        room: string,
        address: string
    }
}

function EventsIndex(props: { kioskMode: boolean }) {

    const [state] = useState<{ events: EventDetails[] }>({
        events: [{
            uuid: "random-uuid",
            startDate: new Date("2022-06-15T00:05:00.00Z"),
            endDate: new Date("2022-06-15T00:06:00.00Z"),
            name: "Traditional Woodcarving",
            shortDescription: "",
            longDescription: "",
            totalSpots: 8,
            availableSpots: 0,
            host: "Hans Schwalm",
            cost: 0.00,
            location: {
                room: "Classroom - Interactive",
                address: "1825 Monetary Ln #104 Carrollton, TX 75006"
            }
        }]
    })

    return <div className="events index">
        {props.kioskMode ? <EventsKioskClock/> : false}
        <div className="text-right">
            <a href="/events/calendar"><i className="fa fa-calendar" aria-hidden="true"/> Calendar View</a> <br/>
            <a href="/events/feed/rss"><i className="fa fa-rss" aria-hidden="true"/> RSS</a>
            <a href="/events/feed/atom"><i className="fa fa-rss" aria-hidden="true"/> ATOM</a>
        </div>
        <div className="page-header">
            <div className="row">
                <div className="col-sm-7">
                    <h1 style={{'marginTop': 0}}>Upcoming Classes and Events</h1>
                </div>
                <div className="col-sm-5 text-right">
                    <div className="btn-group">
                        <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            By Type <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right">
                            <li><a href="/?type=1">Class</a></li>
                            <li><a href="/?type=2">Event</a></li>
                        </ul>
                    </div>
                    <div className="btn-group">
                        <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            By Category <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right scrollable-menu">
                            {TempData.categories.map(({name, uuid}) =>
                                <li>
                                    <a href={"/?category=" + uuid}>{name}</a>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="btn-group">
                        <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            By Tool <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right scrollable-menu">
                            {TempData.tools.map(({name, uuid}) =>
                                <li>
                                    <a href={"/?tool=" + uuid}>{name}</a>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="btn-group">
                        <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            By Room <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right scrollable-menu">
                            {TempData.rooms.map(({name, uuid}) =>
                                <li>
                                    <a href={"/?room=" + uuid}>{name}</a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <ul className="list-inline active-filters">
            </ul>
            <div className="row">
                <div className="col-md-offset-8 col-md-4">
                    <div className="text-right">
                        Sort By:
                        &nbsp;
                        <a className="asc" href="/?sort=Events.event_start&amp;direction=desc">Latest Events <i
                            className="glyphicon glyphicon-chevron-up"></i></a> &nbsp;
                        <a href="/?sort=Events.created&amp;direction=asc">Created Recently <i
                            className="glyphicon glyphicon-chevron-down"></i></a></div>
                </div>
            </div>
        </div>
        <div className="event-list">
            {state.events.map((event) => {
                return <EventsEventLine eventDetails={event} key={event.uuid}/>
            })}
            <div className="date-break">
                Tuesday, June 14
            </div>
            {/*<div className="panel event-panel panel-default">
                <div className="panel-heading" role="tab" id="heading-1">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-1"
                       aria-expanded="false" aria-controls="collapse-1" className="collapsed">
                        <h4 className="panel-title">
<span className="time">
7:00pm </span>
                            <strong>FULL: </strong>Traditional Woodcarving </h4>
                    </a>
                </div>
                <div id="collapse-1" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-1">
                    <div className="panel-body">
                        <table className="table table-condensed">
                            <tbody>
                            <tr>
                                <td><strong>When</strong></td>
                                <td>
                                    Tue Jun 14 7pm —
                                    9pm
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Where</strong></td>
                                <td>
                                    Classroom - Interactive<br/>
                                    1825 Monetary Ln #104 Carrollton, TX 75006
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Details</strong></td>
                                <td>Wood carving using traditional hand tools</td>
                            </tr>
                            <tr>
                                <td><strong>Host</strong></td>
                                <td>Hans Schwalm</td>
                            </tr>
                            <tr>
                                <td><strong>Cost</strong></td>
                                <td>$0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <a href="/events/view/17967">More Info and RSVP »</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>*/}
            <div className="panel event-panel panel-default">
                <div className="panel-heading" role="tab" id="heading-2">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-2"
                       aria-expanded="false" aria-controls="collapse-2" className="collapsed">
                        <h4 className="panel-title"><span className="time">
7:00pm </span>
                            Jewelry Committee Meeting </h4>
                    </a>
                </div>
                <div id="collapse-2" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-2">
                    <div className="panel-body">
                        <table className="table table-condensed">
                            <tbody>
                            <tr>
                                <td><strong>When</strong></td>
                                <td>
                                    Tue Jun 14 7pm —
                                    8pm
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Where</strong></td>
                                <td>
                                    Online Only<br/>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Details</strong></td>
                                <td>Monthly Committee Meeting</td>
                            </tr>
                            <tr>
                                <td><strong>Host</strong></td>
                                <td>Joseph Lahoud</td>
                            </tr>
                            <tr>
                                <td><strong>Cost</strong></td>
                                <td>$0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <a href="/events/view/18254">More Info and RSVP »</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="panel event-panel panel-default">
                <div className="panel-heading" role="tab" id="heading-3">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-3"
                       aria-expanded="false" aria-controls="collapse-3" className="collapsed">
                        <h4 className="panel-title">
<span className="time">
7:30pm </span>
                            <strong>FULL: </strong>Blacksmithg Tools Qual: KMG, induction forge, Hydraulic Press and
                            Cutoff Saw - $10.00 </h4>
                    </a>
                </div>
                <div id="collapse-3" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-3">
                    <div className="panel-body">
                        <table className="table table-condensed">
                            <tbody>
                            <tr>
                                <td><strong>When</strong></td>
                                <td>
                                    Tue Jun 14 7:30pm —
                                    10:30pm
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Where</strong></td>
                                <td>
                                    Workshop - Blacksmithing<br/>
                                    1825 Monetary Ln #104 Carrollton, TX 75006
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Details</strong></td>
                                <td>Familiarize yourself with the KMG, metal cutoff saw, Induction forge and hydraulic
                                    press
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Host</strong></td>
                                <td>Dan Henderson</td>
                            </tr>
                            <tr>
                                <td><strong>Cost</strong></td>
                                <td>$10.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <a href="/events/view/18248">More Info and RSVP »</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="date-break">
                Wednesday, June 15
            </div>
            <div className="panel event-panel panel-default">
                <div className="panel-heading" role="tab" id="heading-4">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-4"
                       aria-expanded="false" aria-controls="collapse-4" className="collapsed">
                        <h4 className="panel-title">
<span className="time">
10:00am </span>
                            <strong>FULL: </strong>Ceramics - Beginner's Throwing 101 </h4>
                    </a>
                </div>
                <div id="collapse-4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-4">
                    <div className="panel-body">
                        <table className="table table-condensed">
                            <tbody>
                            <tr>
                                <td><strong>When</strong></td>
                                <td>
                                    Wed Jun 15 10am —
                                    12pm
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Where</strong></td>
                                <td>
                                    Workshop - Ceramics<br/>
                                    1825 Monetary Ln #104 Carrollton, TX 75006
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Details</strong></td>
                                <td>Learn the basics about throwing on the pottery wheel</td>
                            </tr>
                            <tr>
                                <td><strong>Host</strong></td>
                                <td>Monika Troester</td>
                            </tr>
                            <tr>
                                <td><strong>Cost</strong></td>
                                <td>$0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <a href="/events/view/18236">More Info and RSVP »</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="panel event-panel panel-default">
                <div className="panel-heading" role="tab" id="heading-5">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-5"
                       aria-expanded="false" aria-controls="collapse-5" className="collapsed">
                        <h4 className="panel-title">
<span className="time">
6:30pm </span>
                            <strong>FULL: </strong>Woodshop Basics - $10.00 </h4>
                    </a>
                </div>
                <div id="collapse-5" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-5">
                    <div className="panel-body">
                        <table className="table table-condensed">
                            <tbody>
                            <tr>
                                <td><strong>When</strong></td>
                                <td>
                                    Wed Jun 15 6:30pm —
                                    9:30pm
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Where</strong></td>
                                <td>
                                    Workshop - Woodworking (Excludes Lathe and Multicam)<br/>
                                    1825 Monetary Ln #104 Carrollton, TX 75006
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Details</strong></td>
                                <td>Woodshop safety and procedures</td>
                            </tr>
                            <tr>
                                <td><strong>Host</strong></td>
                                <td>Thomas Lorkowski</td>
                            </tr>
                            <tr>
                                <td><strong>Cost</strong></td>
                                <td>$10.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <a href="/events/view/18168">More Info and RSVP »</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="panel event-panel panel-default">
                <div className="panel-heading" role="tab" id="heading-6">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-6"
                       aria-expanded="false" aria-controls="collapse-6" className="collapsed">
                        <h4 className="panel-title">
<span className="time">
6:30pm </span>
                            <strong>FULL: </strong>Shapeoko 3 XXL for plastics and related material </h4>
                    </a>
                </div>
                <div id="collapse-6" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-6">
                    <div className="panel-body">
                        <table className="table table-condensed">
                            <tbody>
                            <tr>
                                <td><strong>When</strong></td>
                                <td>
                                    Wed Jun 15 6:30pm —
                                    Thu Jun 16 9pm
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Where</strong></td>
                                <td>
                                    Classroom - Lecture Hall<br/>
                                    1825 Monetary Ln #104 Carrollton, TX 75006
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Details</strong></td>
                                <td>Basic operation of the PigSig Shapeoko 3 XL</td>
                            </tr>
                            <tr>
                                <td><strong>Host</strong></td>
                                <td>Jay Phelps</td>
                            </tr>
                            <tr>
                                <td><strong>Cost</strong></td>
                                <td>$0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <a href="/events/view/18181">More Info and RSVP »</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://calendar.dallasmakerspace.org/js/kiosk.js"></script>
    </div>
}

function App() {
    const [appState] = useState({
        isLoggedIn: true,
        canCreateEvents: true
    });

    return (
        <div className="App">
            <MainNavigation isLoggedIn={appState.isLoggedIn} canCreateEvents={appState.canCreateEvents}/>
            <div className="container">
                <EventsIndex kioskMode={false}></EventsIndex>
            </div>
            <footer>
                <div className="container text-center">
                    <ul className="list-inline">
                        <li><a href="https://dallasmakerspace.org/privacy/">Privacy Policy</a></li>
                        <li><a href="https://dallasmakerspace.org/refunds/">Refund Policy</a></li>
                        <li><a href="https://dallasmakerspace.org/wiki/Rules_and_Policies">Rules &amp; Policies</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default App;
