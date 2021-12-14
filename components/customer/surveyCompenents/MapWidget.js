import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
export function init(SurveyKo) {
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
      // SurveyKo.JsonObject.metaData.addProperties("mapselectpoint", [
      //   { name: "buttonText", default: "Click Me" },
      // ]);
    },
    isDefaultRender: false,
    htmlTemplate: "<div><input /> Map below <div id='mapsurvey' style='height:300px;'></div></div>",
    afterRender: function (question, el) {
      var mapEl = el.getElementsByTagName("div")[0];
      var map = L.map(mapEl).setView([56.38775579397605, -114.1411612983107], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      map.invalidateSize();
      let marker;
      map.on("click", function (e) {
        if (marker) {
          map.removeLayer(marker);
        }
        marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        question.value = marker.getLatLng();
        console.log(marker.getLatLng())
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