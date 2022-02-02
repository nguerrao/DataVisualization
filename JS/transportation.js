function transportation() {

// set the dimensions and margins of the graph
    const margin = {top: 20, right: 10, bottom: 10, left: 10},
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
    const svg = d3.select("#transportationViz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// read json data
    d3.json("data/transport.json", function(data) {

        // Give the data to this cluster layout:
        const root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data

        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([width-155, height-155])
            .paddingInner(3)      // Padding between each rectangle
            .paddingOuter(6)
            (root)

        // prepare a color scale
        const color = d3.scaleOrdinal().range(["#023e8a","#33a1fd","#1e96fc", "#0008ff", "#3a86ff", "#00509d"])

        // use this information to add rectangles:
        svg
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("fill", function(d){
                return color(d.data.name)} )

        svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function(d){
                if (d.data.percentage === "44.99%") {
                    return d.x0+170
                }
                if (d.data.percentage === "29.72%") {
                    return d.x0+170
                }
                if (d.data.percentage === "11.57%") {
                    return d.x0+40
                }

                if (d.data.percentage === "10.59%") {
                    return d.x0+40
                }

                if (d.data.percentage === "0.96%") {
                    return d.x0+2
                }

                if (d.data.percentage === "2.14%") {
                    return d.x0+30
                }
            })
            .attr("y", function(d){
                if (d.data.percentage === "44.99%") {
                    return d.y0+150
                }
                if (d.data.percentage === "29.72%") {
                    return d.y0+100
                }
                if (d.data.percentage === "11.57%") {
                    return d.y0+120
                }

                if (d.data.percentage === "10.59%") {
                    return d.y0+100
                }

                if (d.data.percentage === "0.96%") {
                    return d.y0+35
                }

                if (d.data.percentage === "2.14%") {
                    return d.y0+35
                }
          })
            .text(function(d){ return d.data.percentage})
            //.text(["45%", "29.7%", "11.575%", "10.5%", "0.9617%", "2.148%"])
            .attr("font-size", "14px")
            .attr("fill", "white")
            .attr("font-family", "Helvetica")
            .attr("font-weight", "bold")
            .attr("z-index", "10000")
            .style("opacity", 1)

        //For icons
        const carImg = svg.append('image')
            .attr('xlink:href', "imgs/baby-car.svg")
            .attr('width', 40)
            .attr('height', 40)
            .attr("x", 540)
            .attr("y", 25);

        const yatchImg = svg.append('image')
            .attr('xlink:href', "imgs/yatch.svg")
            .attr('width', 40)
            .attr('height', 40)
            .attr("x", 540)
            .attr("y",100);


        const planeImg= svg.append('image')
            .attr('xlink:href', "imgs/travelling.svg")
            .attr('width', 40)
            .attr('height', 40)
            .attr("x", 540)
            .attr("y",175);

        const truckImg = svg.append('image')
            .attr('xlink:href', "imgs/truck.svg")
            .attr('width', 40)
            .attr('height', 40)
            .attr("x", 540)
            .attr("y", 250);

        const trainImg = svg.append('image')
            .attr('xlink:href', "imgs/train.svg")
            .attr('width', 40)
            .attr('height', 40)
            .attr("x", 540)
            .attr("y",325);

        const pipeLineImg = svg.append('image')
            .attr('xlink:href', "imgs/clog.svg")
            .attr('width', 40)
            .attr('height', 40)
            .attr("x", 540)
            .attr("y",400);

        //drag and drop selection
        let deltaX, deltaY;

        const dragHandler = d3.drag()
            .on("start", function () {
                const current = d3.select(this);
                deltaX = current.attr("x") - d3.event.x;
                deltaY = current.attr("y") - d3.event.y;
            })
            .on("drag", function () {
                d3.select(this)
                    .attr("x", d3.event.x + deltaX)
                    .attr("y", d3.event.y + deltaY);
            });

        dragHandler(svg.selectAll("image"));

//event for the correct me
        d3.select('#correct-button')
            .on('click', function() {
                //carImg.attr("x", 500).attr("y", 200);
                carImg.transition()
                    .duration(2000)
                    .attr("x", 180)
                    .attr("y", 160);
                yatchImg.transition()
                    .duration(2000)
                    .attr("x", 430)
                    .attr("y", 350);
                planeImg.transition()
                    .duration(2000)
                    .attr("x", 430)
                    .attr("y", 140);
                truckImg.transition()
                    .duration(2000)
                    .attr("x", 180)
                    .attr("y", 410);
                trainImg.transition()
                    .duration(2000)
                    .attr("x", 380)
                    .attr("y", 460);
                pipeLineImg.transition()
                    .duration(2000)
                    .attr("x", 455)
                    .attr("y", 455);
                    //.attr('width', 50)
                    //.attr('height', 50)

                svg.selectAll(".text")
                    .data(root.leaves())
                    .enter()
                    .append("text")
                    .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
                    .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
                    .text(function(d){ return d.data.name })
                    .attr("font-size", "15px")
                    .attr("fill", "white")
                    .attr("font-family", "Helvetica")
                    .attr("font-weight", "bold")
                    .transition()
                    .duration(10000)
            })
    })
}
