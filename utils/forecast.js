const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/3293117e9915ada0bd705b9428cd441c/${latitude},${longitude}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to Weather Service!");
    } else if (body.error) {
      callback("Unable to find Location");
    } else {
      callback(undefined, {
        summary: body.daily.data[0].summary,
        current: {
          temperature: body.currently.temperature,
          precipitation: body.currently.precipProbability
        },
        forecast: `${body.daily.data[0].summary}It is currently ${body.currently.temperature}F and there is a ${body.currently.precipProbability}% chance of rain. Temperatures will reach a high of ${body.daily.data[0].temperatureMax}F and a low of ${body.daily.data[0].temperatureMin}F`
      });
    }
  });
};

module.exports = forecast;
