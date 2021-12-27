import React, { useState, useEffect, useRef } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

function EditableLayer(props) {
  const leaflet = useMap();
  const editLayerRef = useRef();
  let drawControlRef = useRef();
  let map = leaflet;

  useEffect(() => {
    if (!props.showDrawControl) {
      map.removeControl(drawControlRef.current);
    } else {
      map.addControl(drawControlRef.current);
    }
    editLayerRef.current.clearLayers();
    editLayerRef.current.addLayer(props.layer);
    
    props.layer.on("click", function (e) {
      props.onLayerClicked(e, drawControlRef.current);
    });
  }, [props, map]);

  function onMounted(ctl) {
    drawControlRef.current = ctl;
  }

  return (
    <div>
      <FeatureGroup ref={editLayerRef}>
        <EditControl
          position='bottomleft'
          onEdited={props.onUpdate}
          onDeleted={props.onDeleted}
          draw={props.draw}
          edit={props.edit}
          onMounted={onMounted}
          {...props}
        />
      </FeatureGroup>
    </div>
  );
}

function EditableGroup(props) {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  function handleLayerClick(e, drawControl) {
    setSelectedLayerIndex(e.target.feature.properties.editLayerId);
  }
  let layers = [];
  let i = 0;

  

  props.dataLayer.eachLayer((layer) => {
    layer.feature.properties.editLayerId = i;
    layers.push(layer);
    i++;
  });


  return (
    <div>
      {layers.map((layer, i) => {
        return (
          <EditableLayer
            key={i}
            layer={layer}
            {...props}
            showDrawControl={i === selectedLayerIndex}
            onLayerClicked={handleLayerClick}
          />
        );
      })}
    </div>
  );
}


export default EditableGroup;
