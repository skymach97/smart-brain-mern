import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register'
import Signin from './components/Signin/Signin';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const particlesOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 8
            },
            image: {
                src: "img/github.svg",
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 8,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: false,
                mode: "repulse"
            },
            onclick: {
                enable: false,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 0,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
};

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}
class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    calculateFaceLocation = (data) => {
        // const apiAge = data.outputs[0].data.regions[1].data.face.age_appearance.concepts[0].name
        const clarifaiFaces = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return clarifaiFaces.map(face => {
            return {
                topRow: face.top_row * height,
                leftCol: face.left_col * width,
                bottomRow: height - (face.bottom_row * height),
                rightCol: width - (face.right_col * width)
            }
        });

    }

    displayFaceBox = (boxes) => {
        this.setState({ boxes: boxes });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonClick = (event) => {
        this.setState({ imageUrl: this.state.input });
        fetch("https://arcane-waters-07721.herokuapp.com/imageurl", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: this.state.input,
            })
        })
            .then((response) => response.json())
            .then(response => {
                if (response) {
                    fetch("https://arcane-waters-07721.herokuapp.com/image", {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: this.state.user.id,
                        })
                    })
                  .then((response) => response.json())
                  .then(count => {
                    this.setState(Object.assign(this.state.user, { entries: count}));
                  })
                  .catch(console.log())
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState);
        } else if (route === 'home') {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    }
    render() {
      const { isSignedIn, imageUrl, route, boxes } = this.state;
        return (
            <div className="App">
                  <Particles className='particles' params={particlesOptions} />
                    <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
                    {route === 'home'
                    ?<div>
                    <Logo />
                    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonClick={this.onButtonClick}  />
                    <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
                    </div>
                    :(
                      route === 'signin'
                    ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    :<Register 
                    loadUser={this.loadUser}
                    onRouteChange={this.onRouteChange}/>
                    )
                    }
                </div>
        )
    }
}


export default App;