import { Loader } from "@googlemaps/js-api-loader";
export function init(SurveyKo) {
  let widget = { //the widget name. It should be unique and written in lowercase.
    name: "googlemap",
    title: "google map survey",
    iconName: "my-custom-icon",
    widgetIsLoaded: function () {
      return true; //We do not have external scripts
    },
    isFit: function (question) {
      return question.getType() == "googlemap";
    },
    init() {
      // SurveyKo.Serializer.addClass("map", [], null, "empty");
    },
    activatedByChanged: function (activatedBy) {
      SurveyKo.JsonObject.metaData.addClass("googlemap", [], null, "text");
      SurveyKo.JsonObject.metaData.addProperties("googlemap", [
        { name: "lat", default: 41 },
        { name: "lng", default: 28 },
      ]);
      createProperties(SurveyKo);
    },
    isDefaultRender: false,
    htmlTemplate:
      "<div class='custom-tessting-input' id='google-map-design'></div>",
    afterRender: function (question, el) {
      var findDiv = document.getElementById("google-map-design");
      findDiv.style.height = "500px";
      findDiv.style.width = "100%";
      let loader = new Loader({
        apiKey: "AIzaSyBlgQUaksdGk8QypFdyyOFwU8d07giTsuE",
      });
      loader
        .load()
        .then((google) => {
          const uluru = { lat: -25.344, lng: 131.036 };
          let map = new google.maps.Map(document.getElementById("google-map-design"), {
            center: uluru,
            zoom: 8,
          });
          let marker;
          google.maps.event.addListener(map, 'click', function (e) {
            question.lat = e.latLng.lat();
            question.lng = e.latLng.lng();
            if (marker) {
              marker.setPosition(e.latLng);
            } else {
              marker = new google.maps.Marker({
                position: e.latLng,
                map: map
              });
            }
            map.setCenter(e.latLng);
          })
        })
        .catch((err) => { });
    },
  }

  SurveyKo.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    "customtype"
  );
  function createProperties(Survey) {
    var props = createGeneralProperties(Survey);
    return props;
  }
  function createGeneralProperties(Survey) {
    return Survey.Serializer.addProperties("googlemap", [
      {
        name: "latitude:textbox",
        category: "general",
        default: "29.635703",
      },
      {
        name: "longitude:textbox",
        category: "general",
        default: "52.521924",
      },
    ]);
  }

  //We do not need default rendering here.
  //SurveyJS will render this template by default

};

