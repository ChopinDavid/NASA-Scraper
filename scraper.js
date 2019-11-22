var request = require('request');

var month = 3;
var day = 2;
var year = 1904;

let apiKey = "******";

function scrapeURL() {
    let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${year}-${month}-${day}&end_date=${year}-${month}-${day}}&api_key=${apiKey}`;

    request.get(
        url,
        function(error, response, body) {
            var dateString = `${year}`;
            if (month.toString().length == 1) {
                dateString += `-0${month}`;
            } else {
                dateString += `-${month}`;
            }
            if (day.toString().length == 1) {
                dateString += `-0${day}`;
            } else {
                dateString += `-${day}`;
            }
            if (JSON.parse(body)["near_earth_objects"] != undefined) {
                let nearEarthObjects = JSON.parse(body)["near_earth_objects"][dateString];
                for (i in nearEarthObjects) {
                    let object = nearEarthObjects[i];
                    let id = object["id"];
                    let name = encodeURIComponent(object["name"]).replace(/\(/g, "%28").replace(/\)/g, "%29");
                    let estimatedDiameterMin = object["estimated_diameter"]["miles"]["estimated_diameter_min"];
                    let estimatedDiameterMax = object["estimated_diameter"]["miles"]["estimated_diameter_max"];
                    let isPotentiallyHazardous = object["is_potentially_hazardous_asteroid"];
                    var hazardInt = 0
                    if (isPotentiallyHazardous == true) {
                        hazardInt = 1
                    }
                    let approachDate = object["close_approach_data"][0]["epoch_date_close_approach"];
                    let approachSpeed = object["close_approach_data"][0]["relative_velocity"]["miles_per_hour"];
                    let missDistance = object["close_approach_data"][0]["miss_distance"]["miles"];

                    let apiURL = `https://www.allcapssoftwareinc.com/postAsteroid.php?id=${id}&name=${name}&estimatedDiameterMin=${estimatedDiameterMin}&estimatedDiameterMax=${estimatedDiameterMax}&isPotentiallyHazardous=${hazardInt}&approachDate=${approachDate}&approachSpeed=${approachSpeed}&missDistance=${missDistance}`
                    console.log(apiURL);
                    request.post(
                        apiURL,
                        function(error, response, body) {
                            setTimeout(function() {
                                console.log(error);
                            }, 5000);
                        }
                    );
                }
            }

            setTimeout(function() {
                if (day == 31) {
                    if (month == 12) {
                        year += 1;
                        month = 1;
                        day = 1;
                    } else {
                        month += 1;
                        day = 1;
                    }

                } else {
                    day += 1;
                }

                scrapeURL();
            }, 1000);
        }
    );
}

scrapeURL();