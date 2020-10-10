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
    initInfo();
    updateMap(1900);
    updateBars(1900);
    updateInfo(1900);
}
function initInfo(){
    d3.select("#info")
    .append("rect")
    .attr("y", "550")
    .attr("x", "120")
    .attr("height", "200")
    .attr("width", "1150")
    .style("stroke", "black")
    .style("fill", "transparent")
    var info = d3.select("#info")
    info.append("text")
    .text("")
    .attr("id", "yearText")
    .attr("x", "575")
    .attr("y", "570")
    info.append("text")
    .text("")
    .attr("id", "popText")
    .attr("x", "125")
    .attr("y", "605")
    info.append("text")
    .text("")
    .attr("id", "totalVotesText")
    .attr("x", "125")
    .attr("y", "645")
    info.append("text")
    .text("")
    .attr("id", "demText")
    .attr("x", "785")
    .attr("y", "605")
    info.append("text")
    .text("")
    .attr("id", "repText")
    .attr("x", "785")
    .attr("y", "605")
    info.append("text")
    .text("")
    .attr("id", "otherText")
    .attr("x", "785")
    .attr("y", "605")
    info.append("text")
    .text("winnerText")
    .attr("id", "winnerText")
    .attr("x", "125")
    .attr("y", "685")
    info.append("text")
    .text("")
    .attr("id", "popVoteText")
    .attr("x", "125")
    .attr("y", "725")
    info.append("text")
    .text("")
    .attr("id", "dPopText")
    .attr("x", "785")
    .attr("y", "645")
    info.append("text")
    .text("")
    .attr("id", "rPopText")
    .attr("x", "785")
    .attr("y", "645")
    info.append("text")
    .text("")
    .attr("id", "oPopText")
    .attr("x", "785")
    .attr("y", "645")
    info.append("text")
    .text("")
    .attr("id", "dElectoralText")
    .attr("x", "785")
    .attr("y", "685")
    info.append("text")
    .text("")
    .attr("id", "rElectoralText")
    .attr("x", "785")
    .attr("y", "685")
    info.append("text")
    .text("")
    .attr("id", "oElectoralText")
    .attr("x", "785")
    .attr("y", "685")
    
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
        d3.select("#bars").selectAll("#bar")
            .on("click", function(d) {
                curYear = document.getElementById("dropdown").value;
                d3.selectAll("#bar").style("stroke", "black")
                .style("stroke-width", "1px")
            
                const color = colors[totals.indexOf(d)]
                if (color == "red"){
                    d3.select(this).style("stroke", "gold")
                    .style("stroke-width", "3px")
                    updateInfo(curYear, "R")
                }
                else if (color == "blue"){
                    d3.select(this).style("stroke", "gold")
                    .style("stroke-width", "3px")
                    updateInfo(curYear, "D")
                }
                else if (color == "green"){
                    d3.select(this).style("stroke", "gold")
                    .style("stroke-width", "3px")
                    updateInfo(curYear, "O")
                }
                else {
                    updateInfo(curYear)
                }
                // grey n/a bar represents states that didn't exist yet, just clears the specific text on click
            })
        
        
    })
}
function updateInfo(year, selectedBar = null){
    d3.csv("infoData.csv").then(data =>{
        const election = data.find(election => election.year == year)
        var winner
        var loser
        var loserParty
        if (election.winner == "R"){
            winner = election.rep
            loser = election.dem
            loserParty = "D"
        }
        else {
            winner = election.dem
            loser = election.rep
            loserParty = "R"
        }
        var info = d3.select("#info")
        info.selectAll("text").text("")
        info.select("#yearText")
        .text(`${election.year} Presidential Election`)
        info.select("#popText")
        .text(`Total United States Population: ${Number(election.population).toLocaleString('en-US')}`)
        info.select("#totalVotesText")
        .text(`Total Number of Votes Cast: ${(Number(election.dPop) + Number(election.rPop) + Number(election.oPop)).toLocaleString('en-US')}`)
        info.select("#winnerText")
        .text(`Winner: ${winner} (${election.winner})`)
        if (election.winner != election.popVote){
            info.select("#popVoteText")
            .text(`Popular Vote Winner: ${loser} (${loserParty})`)
        }
        if (selectedBar != null){
            if (selectedBar == "R"){
                info.select("#repText").text(`Republican Candidate: ${election.rep}`)
                info.select("#rElectoralText").text(`Electoral Votes Received: ${election.rElectoral}`)
                info.select("#rPopText").text(`Popular Vote Received: ${Number(election.rPop).toLocaleString('en-US')}`)
            }
            else if (selectedBar == "D"){
                info.select("#demText").text(`Democratic Candidate: ${election.dem}`)
                info.select("#dElectoralText").text(`Electoral Votes Received: ${election.dElectoral}`)
                info.select("#dPopText").text(`Popular Vote Received: ${Number(election.dPop).toLocaleString('en-US')}`)
            }
            else if (selectedBar == "O"){
                info.select("#otherText").text(`Third-Party Candidate: ${election.other}`)
                info.select("#oElectoralText").text(`Electoral Votes Received: ${election.oElectoral}`)
                info.select("#oPopText").text(`Popular Vote Received: ${Number(election.oPop).toLocaleString('en-US')}`)
            }
            
        }
        else {
            d3.selectAll("#bar")
            .style("stroke", "black")
            .style("stroke-width", "1px")
        }
    })
}

function changeYear() {
    year = document.getElementById("dropdown").value;
    updateMap(year);
    updateBars(year);
    updateInfo(year);
}