const GeoCoder = require("google-geocoder");
const password = process.env.GRIDSOME_PASSWORD;
const geocodeKey = process.env.GRIDSOME_GEOCODE_KEY;

exports.handler = async (event, context, callback, client) => {
  const body = JSON.parse(event.body);

  // If password provided was incorrect, return an error
  if (body.password !== password) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        errorField: "password",
        errorMessage: "Password incorrect",
      }),
    };
  }

  // If password is correct, carry on with translating the addresses provided
  const addresses = body.addresses;
  let latLngs = [];
  var geo = new GeoCoder({
    key: geocodeKey,
  });

  addresses.forEach((address) => {
    if (address.length >= 6) {
      geo.find(address, function(err, res) {
        if (!err) {
          latLngs.push(res[0].location);
          console.log("LatLng 1:");
          console.log(latLngs);
        } else {
          console.log(err);
        }
      });
    }
  });

  // If no values were generated, return an error
  console.log("LatLng 2:");
  console.log(latLngs);
  if (!latLngs.length) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        errorField: "latLng",
        errorMessage: "No LatLng values generated.",
      }),
    };
  }

  // All good, return the LatLng values as JSON
  return {
    statusCode: 200,
    body: JSON.stringify(latLngs),
  };
};
