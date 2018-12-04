import React, { Component } from 'react';
import './Map.css';
import Leaflet from "leaflet";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }
  componentDidMount() {
    this.map = Leaflet.map('map').setView([44, -72.7317], 7.5);
    Leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', 
    {
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }
  componentWillUnmount() {
    this.map = null;
  };

  render (){
    return(
      <div ref={this.mapRef} id="map" className="map" />
    )
  }



}

export default Map;