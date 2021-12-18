import * as L from 'leaflet';
import * as ELG from "esri-leaflet-geocoder";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
export function init(SurveyKo) {
  let url = process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP
  let widget = {
    name: "mapselectpoint",
    title: "Map select point",
    iconName: "",
    widgetIsLoaded: function () {
      return true; //we do not require anything so we just return true.
    },
    isFit: function (question) {
      return question.getType() === "mapselectpoint";
    },

    activatedByChanged: function (activatedBy) {
      SurveyKo.JsonObject.metaData.addClass("mapselectpoint", [], null, "text");
    },
    isDefaultRender: false,
    htmlTemplate: "<div><input /> Map below <div id='mapsurvey' style='height:300px;'></div></div>",
    afterRender: function (question, el) {
      var mapEl = el.getElementsByTagName("div")[0];
      var map = L.map(mapEl).setView([56.38775579397605, -114.1411612983107], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: `&copy; <a href=${url}`
      }).addTo(map);
      map.invalidateSize();
      // const geocoder = ELG.geocodeService({
      //   apiKey: "AAPKfbae8be22c3243b386735342c33a55db_LFSYugKKprHOSdlwGVZf-XNHIfM9WyRXBxL3wCORsxJ-e3zYrDO3D0b61huKDey"
      // })
      let marker;
      map.on("click", function (e) {
        if (marker) {
          map.removeLayer(marker);
        }
        marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        // geocoder.reverse().latlng(e.latlng).run(function (err, result) {
        //   if (err) {
        //     return;
        //   }
        //   console.log(err);
        //   console.log(result);
        // })
        question.value = marker.getLatLng();
      });

      var text = el.getElementsByTagName("input")[0];
      //set some properties
      text.inputType = question.inputType;
      text.placeholder = question.placeHolder;

      text.onchange = function () {
        question.value = text.value;
      };
      var onValueChangedCallback = function () {
        text.value = question.value ? question.value : "";
      };
      var onReadOnlyChangedCallback = function () {
        if (question.isReadOnly) {
          text.setAttribute("disabled", "disabled");
        } else {
          text.removeAttribute("disabled");
        }
      };
      question.readOnlyChangedCallback = onReadOnlyChangedCallback;
      question.valueChangedCallback = onValueChangedCallback;
      onValueChangedCallback();
      onReadOnlyChangedCallback();
    },
    //Use it to destroy the widget. It is typically needed by jQuery widgets
    willUnmount: function (question, el) {
      //We do not need to clear anything in our simple example
      //Here is the example to destroy the image picker
      //var $el = $(el).find("select");
      //$el.data('picker').destroy();
    },
  };


  //Register our widget in singleton custom widget collection
  SurveyKo.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}