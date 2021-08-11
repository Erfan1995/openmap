import React, { Component } from 'react';
import { FeatureGroup } from 'react-leaflet';
import L, { geoJSON } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import AddMap from './AddMap';
import Preview from './Preview';
import styled from 'styled-components';
// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
import { Card } from "antd";
import { getSpecifictPopup } from 'lib/general-functions';
import { getStrapiMedia } from 'lib/media';
import { MapIconSize } from 'lib/constants';

import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
const PupopDiv = styled.div`
height:200px;
background-color:#000;
border-radius:20px;
`


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
});

//



const mcg = L.markerClusterGroup();
export default class EditControlExample extends Component {

  state = {
    drawerVisible: false,
    modalVisible: false,
    geoData: {},
    type: 'create',
    place: {}
  }

  constructor(props) {
    super(props);
    this.childRef = React.createRef()
    this._leaflets = {};
  }




  _onCreated = (e) => {
    this.setState({ type: 'create' });

    const { layerType, layer } = e;
    let data = null;
    if (layerType === 'polygon' || layerType === 'rectangle') {
      data = { type: 'Polygon', coordinates: [layer.getLatLngs()[0].map((item) => [item.lng, item.lat])] };
    } else {
      data = { type: 'Point', coordinates: [layer._latlng.lng, layer._latlng.lat] };
    }

    this.setState({ drawerVisible: true, geoData: data })
  };




  onDataSaved = () => {
    this.setState({ drawerVisible: false, modalVisible: false })

    this._onChange();

  }

  modalClose = () => {
    this.setState({ modalVisible: false })
  }


  drawerClose = () => {
    this.setState({ drawerVisible: false })
  }

  _editableFG = null;

  _onFeatureGroupReady = (reactFGref) => {

    if (this.state.type === 'create') {
      reactFGref?.clearLayers();
      mcg.clearLayers();
    }
    if (this.props.manualMapData.length > 0) {
      let leafletGeoJSON = new L.GeoJSON(this.props.manualMapData, {
        pointToLayer: (feature, latlng) => {
          const iconUrl = getStrapiMedia(this.props.mapData?.icons.length > 0 ? this.props.mapData?.icons[0]?.icon[0] : null);

            if (!iconUrl) return L.marker(latlng);

          return L.marker(latlng, {
            icon: new L.icon({ iconUrl: feature?.icon?.icon[0] ? getStrapiMedia(feature?.icon?.icon[0]) : iconUrl, iconSize: MapIconSize })
          })
        },
        onEachFeature: (feature = {}, layer) => {
          const { properties } = feature;
          if (!properties) return;

          if (!(this.props.mapData?.mmd_properties)) return;

          if (!(this.props.mapData?.mmd_properties?.length > 0)) return;

          layer.bindPopup(`<div>${getSpecifictPopup(properties, this.props.mapData?.default_popup_style_slug || '', [])}</div>`)
        }
      })
      let leafletFG = reactFGref;
      leafletGeoJSON.eachLayer((layer) => {
        if (this.props.layerClicked) {
          layer.on("click", function (e) {
            this.setState({ modalVisible: true, place: layer.feature });
          }.bind(this));
        }
        if (leafletFG) {
          leafletFG.addLayer(layer);
        }
      });
    }
    this._editableFG = reactFGref;
  };

  _onChange = () => {
    const { onChange } = this.props;
    if (!this._editableFG || !onChange) {
      return;
    }
    onChange();
  };
  render() {


    return (

      <div>
        {
          this.state.drawerVisible && (
            <AddMap
              onDataSaved={this.onDataSaved}
              myVisible={this.state.drawerVisible}
              geoData={this.state.geoData}
              mapData={this.props.mapData}
              modalClose={this.drawerClose}
              userType={this.props.userType}
              userId={this.props.userId}


            />
          )
        }

        {
          this.state.modalVisible && (
            <Preview
              isVisible={this.state.modalVisible}
              place={this.state.place}
              mapData={this.props.mapData}
              onDataSaved={this.onDataSaved}
              dataType={'manual'}
              userType={this.props.userType}
              closePlaceDetails={this.modalClose}
            />
          )}

        <FeatureGroup
          ref={(reactFGref) => {
            this._onFeatureGroupReady(reactFGref);
          }}
        >

          <EditControl
            position="topright"
            onCreated={this._onCreated}
            draw={this.props.draw}
            edit={this.props.edit}
          />
        </FeatureGroup>
      </div>

    );
  }


}
