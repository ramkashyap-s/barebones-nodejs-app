$('.result-btn').on('click', function (){
  //processing the data received
  d3.json("data/userViews.json", function(error, userdata){
    // console.log(error.explicitOriginalTarget.status)
    if (error && error.target.status === 404) {
      return console.log("Error in reading the summary file: File not found");
    }
    else if (error) {
      return console.warn(error);
    }
    resultdata = [];  

    //get keys and values and push them as an array of objects
    Object.getOwnPropertyNames ( userdata ).forEach(function(key){
      resultdata.push({name: key, value: userdata[key]});
    })

    //create graphics using d3 for pie chart
    var width = 260;
    var height = 260;
    var thickness = 40;
    var duration = 750;

    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20);


    var arc = d3.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius);

    var pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);

    var svg = d3.select("#mychart")
                .attr('width', width)
                .attr('height', height);
  
    svg.select("g").remove();
    var g = svg.append("g")
              .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
    
    var path = g.selectAll('path')
      .data(pie(resultdata))
      .enter()
      .append("g")
      .on("mouseover", function(d) {
            let g = d3.select(this)
              .style("cursor", "pointer")
              .style("fill", "black")
              .append("g")
              .attr("class", "text-group");
        
            g.append("text")
              .attr("class", "name-text")
              .text(`${d.data.name}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '-1.2em');
        
            g.append("text")
              .attr("class", "value-text")
              .text(`${d.data.value}`+' views')
              .attr('text-anchor', 'middle')
              .attr('dy', '.6em');
          })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")  
            .style("fill", color(this._current))
            .select(".text-group").remove();
        })
      .append('path')
      .attr('d', arc)
      .attr('fill', (d,i) => color(i))
      .on("mouseover", function(d) {
          d3.select(this)     
            .style("cursor", "pointer")
            .style("fill", "black");
        })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")  
            .style("fill", color(this._current));
        })
      .each(function(d, i) { this._current = i; });

  });
});
