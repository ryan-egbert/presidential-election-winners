// var d3_composite = require("d3-composite-projections");
// var d3_geo = require("d3-geo");

let width = 960;
let height = 500;

let projection = d3.geoAlbersUsa()
                    .translate(width/2,height/2)
                    .scale(10000);

let path = d3.geoPath().projection(projection);

let svg = d3.select("#svg");

d3.csv("state_results.csv", data => {
    return data;
    }).then(data => {
        // let json = await d3.json("data/us-states.json");
        d3.json("us-states.json").then(function(json) {
            // console.log(json.features[12])
            for (let i = 0; i < data.length; i++) {
                let dataState = data[i].state;
                let dataRep = data[i].rep_wins;
                let dataDem = data[i].dem_wins;
        
                // console.log(dataState)
        
                for (let j = 0; j < json.features.length; j++) {
                    let jsonState = json.features[j].properties.names;
                    // console.log(j)
        
                    if (dataState == jsonState) {
                        if (dataRep > dataDem) {
                            json.features[j].properties.party = "red";
                        }
                        else if (dataDem > dataRep) {
                            json.features[j].properties.party = "blue";
                        }
                        else {
                            json.features[j].properties.party = "green";
                        }
                        break;
                    }
                }
            }

            console.log("adding to path")
            console.log(json.features)
            d3.select("#map").selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", d => {
                    return d.properties.party;
            });
        });
});