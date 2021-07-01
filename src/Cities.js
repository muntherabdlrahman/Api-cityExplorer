import React, { Component } from 'react'
import axios from 'axios';
import { Card,ListGroup, Row, Col } from 'react-bootstrap';


export class Cities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            location: '',
            latitude: '',
            longitude: '',
            iemge: '',
            error: '',
            show: false,
            weather: [],
            movies: [],
            newcity: ''


        }
    }





    onchangeForTyping = (e) =>///////1
    {
        this.setState({
            cityName: e.target.value,
            newcity: e.target.value

        })
    }

    toSubmitTheForm = async (e) => {/////2
        try {
            e.preventDefault();
            let urlLocations = `https://us1.locationiq.com/v1/search.php?key=pk.c6f749ed3369fcaa6d4dfb08d3391e9c&city=${this.state.cityName}&format=json`
            let axiosResp = await axios.get(urlLocations).then(response => {
                this.setState({
                    show: true,
                    cityName: response.data[0].display_name,
                    location: response.data[0].display_name,
                    latitude: response.data[0].lat,
                    longitude: response.data[0].lon,
                    error: ' ',

                })
            }).then(async () => {
                let urlMap = `https://maps.locationiq.com/v3/staticmap?key=pk.c6f749ed3369fcaa6d4dfb08d3391e9c&center=${this.state.latitude},${this.state.longitude}&zoom=10`
                let map = await axios.get(urlMap)
                this.setState({
                    iemge: map.config.url
                })
            });

            let weatherUrl = `${process.env.REACT_APP_BACKEND_URL}weather?lat=${this.state.latitude}&lon=${this.state.longitude}`
            let weatherGet = await axios.get(weatherUrl).then(response => {

                this.setState({
                    weather: response.data,
                    show: true
                })
            });

            let movieUrl = `${process.env.REACT_APP_BACKEND_URL}movies?query=${this.state.newcity}`
            let moviesGet = await axios.get(movieUrl).then(response => {

                this.setState({
                    movies: response.data,
                    show: true

                })
            });

        }
        catch {
            this.setState({
                show: false,
                error: 'Try to type correct name of city or be confirm about other input imformations'
            });
        }

    }


    render() {
        return (
            <div style={{ backgroundColor: ('#FAEBE0') }}>
                <header>
                    <h1 style={{ fontFamily: ('cursive') }}>Explore about cities</h1>
                </header>
                <form onSubmit={this.toSubmitTheForm}>
                    <input type='text' placeholder='Type the city name....' onChange={(e) => { this.onchangeForTyping(e) }} />
                    <button type='submit'>Explore!</button>
                </form>
                <h4>
                    {this.state.error}
                </h4>





                {
                    this.state.show &&
                    <h2>Location is:{this.state.location} </h2>, <br />, <br />
                }
                <h2>Location is:{this.state.cityName} </h2><br /><br />
                <h2>Latitude is:{this.state.latitude}</h2><br /><br />
                <h2>Longitude is:{this.state.longitude}</h2><br /><br />
                <h2>The map below</h2>
                <img src={this.state.iemge} alt='Map of City' />

                {
                    this.state.show &&
                    this.state.weather.map((element, index) => {

                        return (
                            <Row>
                               
                            <Card style={{ width: '18rem' }}>
                            <Col>
                                <Card.Header>{element.date} will be {element.description}</Card.Header>
                            </Col>
                            </Card>
                            </Row>

                        )
                    })
                }




                {
                    this.state.show &&
                    this.state.movies.map((ele, indx) => {
                        return (
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={ele.img} />
                                <Card.Body>
                                    <Card.Title>{ele.title}</Card.Title>
                                    <Card.Text>
                                        Have Votes: {ele.votes}
                                    </Card.Text>
                                </Card.Body>
                            </Card>



                        )


                    })
                }
                {/* {
                    this.state.show &&
                    this.state.movies.map((ele, indx) => {
                        return (
                            <img src={ele.img} alt='movies' />


                        )


                    })
                } */}



            </div>
        )
    }
}

export default Cities
