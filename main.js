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
    initBars();
    updateMap(1900);
    
    updateBars(1900);
}

function initBars(){
    d3.select("#bars")
    .append("line")
    .attr("x1", "900")
    .attr("x2", "900")
    .attr("y1", "0")
    .attr("y2", "500")
    .attr("class", "axis")
    d3.select("#bars")
    .append("line")
    .attr("x1", "900")
    .attr("x2", "1400")
    .attr("y1", "500")
    .attr("y2", "500")
    .attr("class", "axis")
    
    const parties = ["Republican", "Democrat", "Other", "N/A"]
    for(var i = 0; i < 4; ++i){
        
        
        d3.select("#bars")
        .append("text")
        .text(parties[i])
        .attr("y", 530)
        .attr("x", 920 + (i * 133))
    }
    for(var i = 0; i < 10; ++i){
        d3.select("#bars")
        .append("line")
        .attr("x1", 895)
        .attr("x2", 905)
        .attr("y1", 10 + (i * 50))
        .attr("y2", 10 + (i * 50))
        .style("stroke", "black")
        .style("stroke-width", "2px")
        d3.select("#bars")
        .append("text")
        .text(50 - i * 5)
        .attr("x", 870)
        .attr("y", 15 + (i * 50))
    }
    d3.select("#bars")
    .append("text")
    .attr("x", 790)
    .attr("y", 240)
    .text("States Won")
    
    
    
    
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
                    //console.log(`${d.properties.name} --> ${d.properties.party}`)
                    return d.properties.party;
                });
        });
    });
}

function updateBars(year){
    d3.csv("state_results_by_year.csv", data => {
        return {
            state: data.state,
            result: data[`${year}`],
            year: year
        };
    }).then(data => {
        
        var totals = [0, 0, 0, 0]
        for(const state of data){
            if (state.result == "R"){
                totals[0] += 1
            }
            else if (state.result == "D"){
                totals[1] += 1
            }
            else if (state.result == "NA"){
                totals[3] += 1
            }
            else { // Other party
                totals[2] += 1
            }
        }
        
        const colors = ["red", "blue", "green", "grey"]
        
        d3.select("#bars").selectAll("#bar")
        .data(totals)
        .enter()
        .append("rect")
        .attr("id", "bar")
        .attr("height", function(d) {
            return ((d / 50) * 500) + "px"
        })
        .attr("x", function(d) {
            return (910 + (totals.indexOf(d) * 125))
        })
        .attr("y", function(d) {
            return 500 - ((d / 50) * 500)
        })
        .attr("width", "100")
        .style("fill", function(d) {
         return colors[totals.indexOf(d)]
        })
        .style("stroke", "black")
        d3.select("#bars").selectAll("#bar")
        .transition()
        .duration(1000)
        .attr("height", function(d) {
            return ((d / 50) * 500) + "px"
        })
        .attr("y", function(d) {
            return 500 - ((d / 50) * 500)
        })
        console.log(`Year: ${year}, R:${totals[0]}, D:${totals[1]}, O:${totals[2]}, NA:${totals[3]}`)
    })
}


function changeYear() {
    year = document.getElementById("dropdown").value;
    updateMap(year);
    updateBars(year)
}