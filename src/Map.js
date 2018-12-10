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
    vermont.setStyle({ fillColor: '#048229', fillOpacity: '0.0005', color: '#048229' })

  }
  componentWillUnmount() {
    this.map = null;
  };

  createMarkerLayer = async () => {
    await this.props.startups.forEach(startup => {
        let address = startup.address.street_1
        let city = startup.address.city
        if (address == null) {
          return
        }
        address = address.split(' ').join('%20')
        city = city.split(' ').join('%20')
        let osmUrl = "https://nominatim.openstreetmap.org/search?q=" + address + "%20" + city + "%20vermont&format=json"
        // console.log(osmUrl)     
        fetch(osmUrl)
          .then((response) => {
            console.log(response.headers);
            // console.log(response.body)
            return response.json();
          })
          .then((myJSON) => {
            if (!myJSON[0]) { return }
            let latlong = [myJSON[0].lat, myJSON[0].lon]
            // console.log(latlong)
            let image = `<img src="${startup.logo_url}"></img>`
            Leaflet.marker(latlong).bindPopup(startup.name + ' ' + image, {
              minWidth: "100px"
            }).addTo(this.map);
          })
          .catch((error) => console.log(error));
      
    })
  }

  render() {
    this.createMarkerLayer();
    return (
      <div ref={this.mapRef} id="map" className="map" />
    )
  }



}

export default Map;