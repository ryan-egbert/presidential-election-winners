// var d3_composite = require("d3-composite-projections");
// var d3_geo = require("d3-geo");

let width = 900;
let height = 500;

let projection = d3.geoAlbersUsa()
                    .translate([width/2,height/2])
                    .scale([1000]);

let path = d3.geoPath().projection(projection);

let svg = d3.select("#svg");

let year = 1900;

function init() {
    for (let i = 1900; i < 2020; i += 4) {
        d3.select("#dropdown")
            .append("option")
            .attr("value", i)
            .text(i)
    }
    updateMap(1900);
}

function updateMap(year) {
    d3.csv("state_results_by_year.csv", data => {
        return {
            state: data.state,
            result: data[`${year}`],
            year: year
        };
    }).then(data => {
        d3.json("us-states.json").then(function(json) {
            for (let i = 0; i < data.length; i++) {
                let dataState = data[i].state;
        
                for (let j = 0; j < json.features.length; j++) {
                    let jsonState = json.features[j].properties.name;
                    if (dataState == jsonState) {
                        if (data[i].result == "R") {
                            json.features[j].properties.party = "red";
                        }
                        else if (data[i].result == "D") {
                            json.features[j].properties.party = "blue";
                        }
                        else if (data[i].result == "NA") {
                            json.features[j].properties.party = "grey";
                        }
                        else {
                            json.features[j].properties.party = "green";
                        }
                        break;
                    }
                }
            }

            d3.select("#map").selectAll("path").remove()
            console.log("removing paths")

            d3.select("#map").selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "black")
                .style("fill", d => {
                    console.log(`${d.properties.name} --> ${d.properties.party}`)
                    return d.properties.party;
                });
        });
    });
}



function changeYear() {
    year = document.getElementById("dropdown").value;
    updateMap(year);
}