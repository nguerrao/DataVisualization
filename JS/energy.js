function energy() {
    // This function generates the stacked bar chart which shows where the energy sources come from
    const margin = {
        top: 47,
        right: 20,
        bottom: 0,
        left: 140,
    }
    let width = 1200 - margin.left - margin.right,
        height = 4480 - margin.top - margin.bottom;

    let y = d3.scaleBand().rangeRound([0, height]).padding(0.3);
    const x = d3.scaleLinear().domain([-100, 100]).range([0, width]);
    const color = d3.scaleOrdinal().range(["#a31621", "#FF890A", "#FCBF49", "#A6994F", "#4C7F4F", "#488B49", "#4AAD52", "#034732"]);
    const l2color = d3.scaleOrdinal().range(["#a21621", "#4C7F4F"]).domain(["High Carbon", "Low Carbon"]);
    const sources = ["coal", "oil", "gas", "nuclear", "solar", "hydro", "wind", "other renewables"];
    color.domain(sources)

    let lastSortKey = 'Entity';
    const xAxis = d3.axisTop(x);
    let yAxis = d3.axisLeft(y);

    let headerSvg = d3.select('#energyHeader')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 70)
        .append("g")
        .attr("transform", "translate(" + (margin.left-3.5) + "," + margin.top + ")");

    let svg = d3.select("#energyChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

    const startPoint2 = headerSvg.append("g");
    // This is the "High Carbon, Low Carbon box"
    const legend2_tabs = [0, 520];
    const legend2_width = [519, 519];
    const legend2 = startPoint2.selectAll(".legend2")
        .data(l2color.domain())
        .enter().append("g")
        .attr("class", "legend2")
        .attr("transform", function (d, i) {
            return "translate(" + legend2_tabs[i] + ",-40)";
        });

    legend2.append("rect")
        .attr("x", 0)
        .attr("width", function (d, i) {
            return legend2_width[i];
        })
        .attr("height", 42)
        .style("fill", l2color)
        .style('opacity', 0.3)
        .on('mouseover', function () {
            d3.select(this)
                .style('opacity', 0.5)
        })
        .on('mouseout', function () {
            d3.select(this)
                .style('opacity', 0.3)
        }).attr("rx", 3)
        .attr("ry", 3);

    legend2.append("text")
        .attr("x", 4)
        .attr("y", 11)
        .attr("dy", ".35em")
        .style("text-anchor", "begin")
        .style("font", "14px sans-serif")
        .style("text-transform", "capitalize")
        .text(function (d) {
            return d;
        });

    // The energy source legend with the small boxes
    const offset = 340;
    const startPoint = startPoint2.append("g");
    const legend_tabs = [4, 60, 120, 184 + offset, 250 + offset, 310 + offset, 380 + offset, 440 + offset];
    const legend = startPoint.selectAll(".legend")
        .data(color.domain().slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(" + legend_tabs[i] + ",-20)";
        })
        .style('opacity', 0.8)
        .on('mouseover', function () {
            d3.select(this)
                .style('opacity', 1)
        })
        .on('mouseout', function () {
            d3.select(this)
                .style('opacity', 0.8)
        });

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .attr("rx", 3)
        .attr("ry", 3);

    legend.append("text")
        .attr("x", 22)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "begin")
        .style("font", "12px sans-serif")
        .style("text-transform", "capitalize")
        .text(function (d) {
            return d;
        });


    let tip = d3.tip().attr('class', 'd3-tip').html(d => {
        return `<strong>${d.country}: </strong><span class='capitalize details'>${d.name}<br/></span>
                <strong>Relative: </strong> <span class='details'>${(d.relative).toFixed(1)} % <br/></span>
                <strong>Absolute: </strong> <span class='details'>${(d.absolute).toFixed(2)} TWh</span>`
    });
    svg.call(tip);

    let isAbsolute = false; // Button state when switching from absolut to relative values in the graph
    let onlyIncludeCountries = false; // Button state for including/excluding countries
    const excludeEntities = ['World', 'Asia Pacific', 'North America', 'Europe', 'Middle East', 'EU27+1', 'EU-27', 'CIS', 'Africa'
        , 'Other Middle East', 'Other Asia & Pacific', 'South & Central America', 'Europe (other)', 'Other CIS',
        'Other Caribbean', 'Other Northern Africa', 'Other South America', 'Other Southern Africa', 'Western Africa']

    loadData();

    function calculateBoxes(data) {
        // This function calculates the size of each box in the rows in every bar chart
        // Here you can change the Year
        const current_year = "2019";
        let current_data = [];
        data.forEach((d, i) => {
            if (onlyIncludeCountries && excludeEntities.includes(d['Entity'])) {
                return;
            }
            if ((d["Year"]) !== current_year) {
                return;
            }
            let total = 0;
            sources.map(name => {
                // Emission value from string to number
                d[name] = Number(d[name]);
                total += d[name];
            });
            // calc percentages
            sources.map(name => {
                // Add percentage as a field to the data in e.g. 'coalPercentage'
                d[name + 'Percentage'] = d[name] * 100 / total;
            });
            // Add up high and low carbon emissions
            d['High Carbon'] = d["coal"] + d["oil"] + d["gas"];
            d['High CarbonPercentage'] = d["coalPercentage"] + d["oilPercentage"] + d["gasPercentage"];
            d['Low Carbon'] = d['nuclear'] + d['solar'] + d['hydro'] + d['wind'] + d['other renewables'];
            d['Low CarbonPercentage'] = d['nuclearPercentage'] + d['solarPercentage'] + d['hydroPercentage']
                + d['windPercentage'] + d['other renewablesPercentage'];

            // calculate where the middle axis gets positioned
            let x0 = (isAbsolute) ? (-(d["coal"] + d["oil"] + d["gas"])) :
                (-(d["coalPercentage"] + d["oilPercentage"] + d["gasPercentage"]));
            // For each country the info for the rectangles gets added here
            d.boxes = sources.map(name => {
                return {
                    name: name,
                    x0: x0,
                    x1: x0 += (isAbsolute) ? d[name] : d[name + 'Percentage'],
                    n: i,
                    absolute: d[name],
                    total: total,
                    country: d['Entity'],
                    relative: d[name + 'Percentage']
                };
            });
            current_data.push(d);
        });
        // The height of the complete bar chart get calculated based on the number of countries in the list
        height = current_data.length * 19.1 - 10;
        return current_data;
    }



    function loadData() {
        // This loads the data from the file and builds the graph
        d3.csv("data/electricity_emissions.csv", function (error, data) {
            data = calculateBoxes(data);

            y = d3.scaleBand().rangeRound([0, height]).padding(0.3);
            yAxis = d3.axisLeft(y);
            d3.select("#energyChart").select("svg")
                .attr("height", height + margin.top + margin.bottom);

            startPoint2.selectAll(".legend2")
                .on("click", function () {
                    lastSortKey = this.textContent;
                    d3.selectAll(".legend, .legend2")
                        .attr("text-decoration", "none");
                    d3.select(this)
                        .attr("text-decoration", "underline");
                    Draw(data);
                });



            startPoint.selectAll(".legend")
                .on("click", function () {
                    lastSortKey = this.textContent;
                    d3.selectAll(".legend, .legend2")
                        .attr("text-decoration", "none");
                    d3.select(this)
                        .attr("text-decoration", "underline");
                    Draw(data);
                });

            Draw(data);

            function changeMode() {
                isAbsolute = !isAbsolute;
                data = calculateBoxes(data);
                Draw(data);
            }

            function setRelative() {
                if (!isAbsolute) {
                    return;
                }
                isAbsolute = false;
                data = calculateBoxes(data);
                Draw(data);
            }

            function setAbsolute() {
                if (isAbsolute) {
                    return;
                }
                isAbsolute = true;
                data = calculateBoxes(data);
                Draw(data);
            }

            function sortAlphabetically() {
                lastSortKey = 'Entity';
                Draw(data);
            }

            function resetView() {
                onlyIncludeCountries = false;
                loadData();
                setRelative();
                sortAlphabetically();
                d3.selectAll(".legend, .legend2")
                    .attr("text-decoration", "none");
                d3.select('#changeMode').text('Absolute values');
                d3.select('#changeCountries').text('Exclude World and Continents')
            }

            d3.select('#changeMode')
                .on('click', function () {
                    changeMode();
                    if (isAbsolute) {
                        d3.select(this).text("Relative values");
                    } else {
                        d3.select(this).text("Absolute Values");
                    }
                })

            d3.select('#relative')
                .on('click', function () {
                    setRelative();
                })

            d3.select('#absolute')
                .on('click', function () {
                    setAbsolute();
                })

            d3.select('#resetView')
                .on('click', function () {
                    resetView();
                })
        });
    }

    function changeCountryList() {
        onlyIncludeCountries = !onlyIncludeCountries;
        loadData();
    }

    d3.select('#changeCountries')
        .on('click', function () {
            changeCountryList();
            if (onlyIncludeCountries) {
                d3.select(this).text("Include World and Continents");
            } else {
                d3.select(this).text("Exclude World and Continents");
            }
        })

    function Sort(data, sortKey, ascending = false) {
        lastSortKey = sortKey;
        if (!isAbsolute && sortKey !== 'Entity') {
            sortKey = sortKey + 'Percentage'
        }

        if (sortKey === 'Entity') {
            ascending = true;
        }
        if (ascending) {
            data.sort(function (a, b) {
                return d3.ascending(a[sortKey], b[sortKey]);
            });
        } else {
            data.sort(function (a, b) {
                return d3.descending(a[sortKey], b[sortKey]);
            });
        }
        return data;
    }

    // Draws the axis and the boxes
    function Draw(data) {
        data = Sort(data, lastSortKey);


        let min_val = d3.min(data, d => {
            return d.boxes["0"].x0;
        });

        let max_val = d3.max(data, d => {
            return d.boxes["7"].x1;
        });

        x.domain([min_val.toFixed(0), max_val.toFixed(0)]);

        y.domain(data.map(d => {
            return d['Entity'];
        }));
        svg = svg.append("g");
        d3.selectAll(".bar").remove();
        d3.selectAll(".y, .axis").remove();

        headerSvg.append("g")
            .attr("class", "x axis")
            .style("position", "fixed")
            .attr("transform", function () {
                return "translate(0,22)";
            })
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        const rows = svg.selectAll(".rows")
            .data(data)
            .enter().append("g")
            .attr("transform", d => {
                return "translate(0," + y(d['Entity']) + ")";
            })
            .attr("class", d => {
                return d.boxes[0].country + " bar"
            });
        // This can be added to get a ridgeline graph with the historical emission data from each country
        // We decided in the end to leave it out as it cluttered the screen too much
        // We still kept the code energy_ridgeline.js in the folder in case someone wants to have a look at it
        // .on('click', d => {
        //     energy_ridgeline(d.boxes[0].country);
        // });

        const bars = rows.selectAll("rect")
            .data(d => {
                return d.boxes;
            })
            .enter().append("g").attr("class", "subbar");

        bars.append("rect")
            .attr("height", y.bandwidth())
            .attr("x", d => {
                return x(d.x0 || 0);
            })
            .attr("width", function (d) {
                return (x(d.x1) - x(d.x0) || 0);
            })
            .style("fill", function (d) {
                return color(d.name);
            }).on('mouseover', function (d) {
            tip.show(d);
            d3.select(this)
                .style('opacity', 0.5)
        })
            .on('mouseout', function (d) {
                tip.hide(d);
                d3.select(this)
                    .style('opacity', 1)
            })
            .attr("rx", 1)
            .attr("ry", 1);

        bars.append("text")
            .attr("x", function (d) {
                return x(d.x0 || 0);
            })
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.5em")
            .attr("dx", "0.5em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "begin");

        rows.insert("rect", ":first-child")
            .attr("height", y.bandwidth())
            .attr("x", "1")
            .attr("width", width)
            .attr("opacity", "0.5")
            .style("fill", "#f0f0f0")
            .attr("class", function (d) {
                return "backgroundBar " + d.boxes[0].country;
            })
            .attr("rx", 1)
            .attr("ry", 1);

        svg.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y2", height);

        d3.selectAll(".axis path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")

        d3.selectAll(".axis line")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")
    }
}
