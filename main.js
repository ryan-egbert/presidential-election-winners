let width = 960;
let height = 500;

let projection = d3.geo.albersUsa()
                    .translate(width/2,height/2)
                    .scale([1000]);

let path = d3.geo.path()
                .projection(projection);

console.log(projection)

let svg = d3.select("#svg");

console.log(svg)

d3.csv("state_results.csv", data => {
    console.log(data)
    d3.json("states.json", json => {
        console.log(json)
        for (let i = 0; i < data.length; i++) {
            let dataState = data[i].state;
            let dataRep = data[i].rep_wins;
            let dataDem = data[i].dem_wins;
            let dataOth = data[i].oth_wins;

            // console.log(dataState)

            for (let j = 0; i < json.states.length; j++) {
                let jsonState = json.states[j].name;
                // console.log(jsonState)

                if (dataState == jsonState) {
                    if (dataRep > dataDem) {
                        json.states[j].party = "red";
                    }
                    else if (dataDem > dataRep) {
                        json.states[j].party = "blue";
                    }
                    else {
                        json.states[j].party = "green";
                    }
                    break;
                }
            }
        }
        console.log("done")
        svg.selectAll("path")
            .data(json.states)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", d => {
                console.log(d.party)
                return d.party;
            });
    });
});