export function init(Survey) {
  let widget = { //the widget name. It should be unique and written in lowercase.
    name: "richedit",
    title: "Rich Editor",
    iconName: "icon-editor",
    widgetIsLoaded: function () {
      return true; //We do not have external scripts
    },
    isFit: function (question) {
      return question.getType() == "richedit";
    },
    init() {
      Survey.Serializer.addClass("richedit", [], null, "empty");
    },
    activatedByChanged: function (activatedBy) {
      //we do not need to check acticatedBy parameter, since we will use our widget for customType only
      //We are creating a new class and derived it from text question type. It means that text model (properties and fuctions) will be available to us
      Survey.JsonObject.metaData.addClass("richedit", [], null, "text");
      //signaturepad is derived from "empty" class - basic question class
      //Survey.JsonObject.metaData.addClass("signaturepad", [], null, "empty");

      //Add new property(s)
      //For more information go to https://surveyjs.io/Examples/Builder/?id=addproperties#content-docs
      Survey.JsonObject.metaData.addProperties("richedit", [
          { name: "buttonText", default: "Click Me" }
      ]);
  },
    isDefaultRender: false,
    htmlTemplate: "<div><input /><button></button></div>",

    //Our element will be rendered base on template.
    //We do not need to do anything here
    afterRender: function (question, el) {
         //el is our root element in htmlTemplate, is "div" in our case
      //get the text element
      var text = el.getElementsByTagName("input")[0];
      //set some properties
      text.inputType = question.inputType;
      text.placeholder = question.placeHolder;
      //get button and set some rpoeprties
      var button = el.getElementsByTagName("button")[0];
      button.innerText = question.buttonText;
      button.onclick = function () {
          question.value = "You have clicked me";
      }

      //set the changed value into question value
      text.onchange = function () {
          question.value = text.value;
      }
      var onValueChangedCallback = function () {
          text.value = question.value ? question.value : "";
      }
      var onReadOnlyChangedCallback = function() {
        if (question.isReadOnly) {
          text.setAttribute('disabled', 'disabled');
          button.setAttribute('disabled', 'disabled');
        } else {
          text.removeAttribute("disabled");
          button.removeAttribute("disabled");
        }
      };
      //if question becomes readonly/enabled add/remove disabled attribute
      question.readOnlyChangedCallback = onReadOnlyChangedCallback;
      //if the question value changed in the code, for example you have changed it in JavaScript
      question.valueChangedCallback = onValueChangedCallback;
      //set initial value
      onValueChangedCallback();
      //make elements disabled if needed
      onReadOnlyChangedCallback();
    }
  }
  Survey.CustomWidgetCollection.Instance.add(
    widget,
    "customtype"
  );
  //We do not need default rendering here.
  //SurveyJS will render this template by default

};

