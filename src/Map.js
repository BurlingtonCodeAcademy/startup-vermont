import React, { Component } from 'react';
import './Map.css';
import Leaflet from "leaflet";
import border_data from "./border.js";


const vermont = Leaflet.geoJSON(border_data);

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }
  componentDidMount() {
    this.map = Leaflet.map('map').setView([44, -72.7317], 7.5);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', 
    {
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    vermont.addTo(this.map);
    vermont.setStyle({fillColor: '#048229', fillOpacity: '0.0005', color: '#048229'})

  }
  componentWillUnmount() {
    this.map = null;
  };

  createMarkerLayer(){
    let markerLayer;
    this.props.startups.map(startup => {
      markerLayer.push(Leaflet.marker(startup.address).bindPopup());
    })
    markerLayer.addTo(this.map);
  }

  render (){
    return(
      <div ref={this.mapRef} id="map" className="map" />
    )
  }



}

export default Map;