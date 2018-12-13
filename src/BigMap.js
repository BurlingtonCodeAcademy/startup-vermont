import React, { Component, Fragment } from "react";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  ZoomControl
} from "react-leaflet";
import "./Map.css";
import L from "leaflet";
import vermonts_border from "./border.js";

class StartupsMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startups: [],
      zoomLevel: 7.5,
      center: [44, -72.7317]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current) {
      this.setState({ startups: [nextProps.current] });
      if (nextProps.current.latlong) {
        let [lat, long] = nextProps.current.latlong
        long = parseFloat(long) - .01
        this.setState({ zoomLevel: 15, center: [lat, long] })
      } else {
        this.setState({ zoomLevel: 7.5, center: [44, -73.9121] })
      }
    } else {
      this.setState({ startups: nextProps.startups, zoomLevel: 7.5, center: [44, -72.7317] });
    }
  }

  render() {
    const center = this.state.center;
    let polygon = (
      <GeoJSON
        data={vermonts_border}
        style={{
          fillColor: "#048229",
          fillOpacity: "0.0005",
          color: "#048229"
        }}
      />
    );

    const myIcon = L.icon({
      iconUrl: require("./Map_pin_icon.svg"),
      iconSize: [15, 20],
      iconAnchor: [0, 20],
      popupAnchor: [8, -20],
      shadowUrl: null,
      shadowSize: null,
      shadowAnchor: null,
      className: "myMarkers"
    });

    return (
      <Map
        id="map"
        ref={this.mapRef}
        center={center}
        zoom={this.state.zoomLevel}
        zoomControl={false}
      >
        <TileLayer
          attribution='Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        {polygon}
        <Fragment>
          {this.state.startups.map(startup => {
            if (startup.latlong) {
              return (
                <Marker
                  icon={myIcon}
                  key={startup.slug}
                  position={startup.latlong}
                  onClick={() => {this.props.updateState(startup)}}
                />
              );
            }
          })}
        </Fragment>
      </Map>
    );
  }
}

export default StartupsMap;
