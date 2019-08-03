function init() {
  draw_scene(1);
}

async function draw_scene(scene_num){
  if(scene_num == 1){
    document.getElementById("magic").innerHTML = "";
    d3.select("#prev").attr("onclick","");
    d3.select("#next").attr("onclick","draw_scene(2)");
    document.getElementById('prev').style.backgroundColor = 'silver';
    document.getElementById('next').removeAttribute("style");

    const data = await d3.csv('https://jnfitzpa.github.io/AvgRateByAge.csv');
    console.log(data);
    var ages = [];
    data.forEach(function(value) {
      ages.push(value.age);
    });
    console.log(ages);
    var lmargin = 80;
    var rmargin = 10;
    var tmargin = 10;
    var bmargin = 50;
    var frameWidth = 800;
    var frameHeight = 500;
    var width = frameWidth-lmargin-rmargin;
    var height = frameHeight-tmargin-bmargin;
    var barThickness = height/(data.length) - 1.0;
    var xScale = d3.scaleLinear().domain([0,600]).range([0,width]);
    var yScale = d3.scaleBand().domain(ages).range([0,height]);

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


    //document.getElementById("data").innerHTML = data.avg;
    d3.select(".chart")
    .attr("width",frameWidth)
    .attr("height",frameHeight)
    .append("g").attr("transform","translate("+lmargin+","+tmargin+")")
    .selectAll("rect").data(data)
    .enter().append("rect")
    .attr("width",function(d) { return xScale(d.avg);})
    .attr("height", barThickness)
    .attr("x",function(d,i) { lmargin; })
    .attr("y",function(d,i) { return (barThickness+1.0)*i; })
    .on("mouseover", function(d) {
      var prem = parseFloat(d.avg);
      div.transition()
          .duration(200)
          .style("opacity", .9);
      div	.html("Age: " + d.age + "<br/>"  + "Premium: $" + prem.toFixed(2))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      div.transition()
          .duration(500)
          .style("opacity", 0)
      });


    d3.select(".chart")
    .append("g")
    .attr("transform","translate("+lmargin+","+tmargin+")")
    .call(
      d3.axisLeft(yScale)
      .tickValues(ages)
    );
    d3.select(".chart")
    .append("g")
    .attr("transform","translate("+lmargin+","+(height+tmargin)+")")
    .call(
      d3.axisBottom(xScale)
      .tickValues([100, 200, 300, 400, 500, 600])
      .tickFormat(d3.format("~s"))
    );

    // text label for the x axis
    d3.select(".chart")
    .append("text")
    .attr("transform","translate(" + (frameWidth/2) + " ," + (frameHeight-.1*bmargin) + ")")
    .style("text-anchor", "middle")
    .text("Average Premium Cost ($)");

    // text label for the y axis
    d3.select(".chart")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Subscriber's Age");



  } else if (scene_num == 2){
    document.getElementById("magic").innerHTML = "";
    d3.select("#prev").attr("onclick","draw_scene(1)");
    d3.select("#next").attr("onclick","draw_scene(3)");
    document.getElementById('prev').removeAttribute("style");
    document.getElementById('next').removeAttribute("style");



    const data = await d3.csv('https://jnfitzpa.github.io/AvgRateByFamilyType.csv');
    console.log(data);
  	var family_types = [];
  	data.forEach(function(value) {
  		family_types.push(value.family_type);
  	});
  	console.log();
  	var lmargin = 200;
  	var rmargin = 10;
  	var tmargin = 10;
  	var bmargin = 50;
  	var frameWidth = 800;
  	var frameHeight = 500;
  	var width = frameWidth-lmargin-rmargin;
  	var height = frameHeight-tmargin-bmargin;
  	var barThickness = height/(data.length) - 1.0;
  	var xScale = d3.scaleLinear().domain([0,110]).range([0,width]);
  	var yScale = d3.scaleBand().domain(family_types).range([0,height]);

  	// Define the div for the tooltip
  	var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  	//document.getElementById("data").innerHTML = data.avg;
  	d3.select(".chart")
  	.attr("width",frameWidth)
  	.attr("height",frameHeight)
  	.append("g").attr("transform","translate("+lmargin+","+tmargin+")")
  	.selectAll("rect").data(data)
  	.enter().append("rect")
  	.attr("width",function(d) { return xScale(d.rate);})
  	.attr("height", barThickness)
  	.attr("x",function(d,i) { lmargin; })
  	.attr("y",function(d,i) { return (barThickness+1.0)*i; })
  	.on("mouseover", function(d) {
  		var prem = parseFloat(d.rate);
  		div.transition()
  				.duration(200)
  				.style("opacity", .9);
  		div	.html("Family Type: " + d.family_type + "<br/>"  + "Premium: $" + prem.toFixed(2))
  				.style("left", (d3.event.pageX) + "px")
  				.style("top", (d3.event.pageY - 28) + "px");
  		})
  	.on("mouseout", function(d) {
  		div.transition()
  				.duration(500)
  				.style("opacity", 0)
  		});


  	d3.select(".chart")
  	.append("g")
  	.attr("transform","translate("+lmargin+","+tmargin+")")
  	.call(
  		d3.axisLeft(yScale)
  		.tickValues(family_types)
  	);
  	d3.select(".chart")
  	.append("g")
  	.attr("transform","translate("+lmargin+","+(height+tmargin)+")")
  	.call(
  		d3.axisBottom(xScale)
  		.tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
  		.tickFormat(d3.format("~s"))
  	);

  	// text label for the x axis
    d3.select(".chart")
  	.append("text")
    .attr("transform","translate(" + (frameWidth/2) + " ," + (frameHeight-.1*bmargin) + ")")
    .style("text-anchor", "middle")
    .text("Average Premium Cost ($)");

  	// text label for the y axis
    d3.select(".chart")
  	.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Family Type");

  }

}
