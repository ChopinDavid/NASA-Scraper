var request = require('request');

var month = 1;
var day = 1;
var year = 1900;

let apiKey = "******";

function scrapeURL() {
    let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${year}-${month}-${day}&end_date=${year}-${month}-${day}&api_key=${apiKey}`;
    console.log(url);

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
            console.log(JSON.parse(body));
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
                            }, 1000);
                        }
                    );
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
            } else if (JSON.parse(body)["error"]["code"] == "OVER_RATE_LIMIT") {
                setTimeout(function() {
                    console.log("Waiting 3600 seconds and rescraping...")
                    scrapeURL();
                }, 3600000);
            }
        }
    );
}

scrapeURL();