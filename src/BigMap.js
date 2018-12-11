import React, { Component, Fragment } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet'
import './Map.css';
import vermonts_border from "./border.js";

class StartupsMap extends Component {
  constructor(props) {
    super(props);
    this.center = [44, -72.7317];
    this.zoomLevel = 7.5
    this.statups = []
    this.state = {
      markers: []
    }
  }

  addMarkers = () => {
    let allstartups = this.startups
    let markers = []
    allstartups.forEach((startup, index) => {
      if (startup.latlong !== null) {
        let latlong = startup.latlong
        markers.push({ key: `marker${index}`, position: [latlong], content: startup.name })
      }
    })
    this.setState({ markers: markers })
  }

  componentDidMount() {
    this.startups = this.props.startups
    this.addMarkers()
  }

  render() {
    const center = this.center
    let polygon = <GeoJSON data={vermonts_border} style={{ fillColor: '#048229', fillOpacity: '0.0005', color: '#048229' }} />

    if (this.state.markers.length > 0) {
      return (
        <Map id='map' ref={this.mapRef} center={center} zoom={this.zoomLevel} zoomControl={false}>
          <TileLayer
            attribution='Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url='https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
          />
          <ZoomControl position="bottomleft" />
          {polygon}
          <Fragment>
            {this.state.markers.map(marker => {
              return (
                <Marker key={marker.key} position={marker.position[0]}>
                  <Popup>{marker.content}</Popup>
                </Marker>
              )
            })}
          </Fragment>
        </Map>
      )
    } else {
      return (
        <Map id='map' ref={this.mapRef} center={center} zoom={this.zoomLevel} zoomControl={false}>
          <TileLayer
            attribution='Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url='https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
          />
          <ZoomControl position="bottomleft" />
          {polygon}
        </Map>
      )
    }
  }
}

export default StartupsMap;