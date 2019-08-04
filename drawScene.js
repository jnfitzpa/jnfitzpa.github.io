//Set the text for the messages
var messages_text =  ["Healthcare premiums vary from state to state. This graph shows the average monthly cost of healthcare in each state for the year 2016. No data was available for states that appear grey. "
,"Aging is inevitable. So are healcare premium hikes. These are the average premiums we have to look forward to as we get older."
,"The size and type of your family also has an impact on how much you pay. This chart details the average premiums for those different family types in 2016."];




function init() {
  draw_scene(1);
}

async function draw_scene(scene_num){
  if(scene_num == 1){
    document.getElementById("magic").innerHTML = "";
    d3.select("#prev").attr("onclick","");
    d3.select("#next").attr("onclick","draw_scene(2)");
      //d3.select("#viz").attr("width","800");
      //d3.select("#viz").attr("height","500");
    var prevEl = document.getElementById('prev');
    prevEl.style.backgroundColor = 'silver';
    prevEl.style.opacity = '.3';
    document.getElementById('next').removeAttribute("style");
    //var parent = document.getElementById("body");
    //var child = document.getElementsByClassName("tooltip");
    //parent.removeChild(child);
    var frameWidth = 800;
    var frameHeight = 600;

    var svg = d3.select("svg")
        //.attr("viewBox","0 0 " + frameWidth + " " +frameHeight)
        .attr("width",frameWidth)
        //.attr("height","auto")
        .attr("viewBox","0 0 1000 600")
        .attr("preserveAspectRatio","xMidYMid meet")
        //.attr("height",frameHeight)
        ,
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var tt = d3.select("#tooltipdiv")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var premium = d3.map();
    var stateNames = d3.map();

    var path = d3.geoPath();

    var x = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([600,700]);

    var color = d3.scaleQuantize()
        .domain([150, 700])
        .range(d3.schemeBuGn[9]);
/*
    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");

    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("premium rate");

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x, i) { return i ? x : x; })
        .tickValues(color.domain()))
      .select(".domain")
        .remove();
*/
    var promises = [
      d3.json("https://d3js.org/us-10m.v1.json"),
      d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(d) {
        stateNames.set(d.id, d.name)
      }),
      d3.tsv("https://jnfitzpa.github.io/AvgRateByState.csv", function(d) {
        console.log("d in map", d);
        premium.set(d.statecode, +d.avg);
      })
    ]
    console.log("before promises")
    Promise.all(promises).then(ready)

    function ready([us]) {
      console.log("in ready", topojson.feature(us, us.objects.states).features)
      console.log("statenames", stateNames)
      console.log("premiums", premium)
      svg.append("g")
          .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("fill", function(d) {
              console.log("d", d)
              //console.log("premium", premium)
              var sn = stateNames.get(parseInt(d.id))
              console.log("sn",sn)
              d.rate = premium.get(sn) //|| 0
              console.log("rate", d.rate)
              var col =  color(d.rate);
              console.log("col", col)
              if (col) {
                //console.log("found col", col, "for d", d)
                return col
              } else {
                return '#A9A9A9'
              }
          })
          .attr("d", path)
          .on("mouseover", function(d) {
            var prem = parseFloat(d.rate);
            var sn = stateNames.get(parseInt(d.id));
            tt.transition()
                .duration(200)
                .style("opacity", .9);
            tt	.html("State: " + sn + "<br/>"  + "Premium: $" + prem.toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            tt.transition()
                .duration(500)
                .style("opacity", 0)
            });
        //.append("title")
          //.text(function(d) {
        	//		console.log("title", d)
        	//		return d.rate; });

      svg.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", path);
    }

    d3.select("#message > p").text(messages_text[scene_num-1]);


  } else if (scene_num == 2) {
    document.getElementById("magic").innerHTML = "";
    d3.select("#prev").attr("onclick","draw_scene(1)");
    d3.select("#next").attr("onclick","draw_scene(3)");
    document.getElementById('prev').removeAttribute("style");
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
    var tt = d3.select("#tooltipdiv")
      .attr("class", "tooltip")
      .style("opacity", 0);


    //document.getElementById("data").innerHTML = data.avg;
    d3.select(".chart")
    .attr("width",frameWidth)
    .attr("height",frameHeight)
    .attr("viewBox","0 0 800 500")
    .append("g").attr("transform","translate("+lmargin+","+tmargin+")")
    .selectAll("rect").data(data)
    .enter().append("rect")
    .attr("width",function(d) { return xScale(d.avg);})
    .attr("height", barThickness)
    .attr("x",function(d,i) { lmargin; })
    .attr("y",function(d,i) { return (barThickness+1.0)*i; })
    .on("mouseover", function(d) {
      var prem = parseFloat(d.avg);
      tt.transition()
          .duration(200)
          .style("opacity", .9);
      tt	.html("Age: " + d.age + "<br/>"  + "Premium: $" + prem.toFixed(2))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      tt.transition()
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

    d3.select("#message > p").text(messages_text[scene_num-1]);

  } else {
    document.getElementById("magic").innerHTML = "";
    d3.select("#prev").attr("onclick","draw_scene(2)");
    d3.select("#next").attr("onclick","");
    document.getElementById('prev').removeAttribute("style");
    var nextEl = document.getElementById('next');
    nextEl.style.backgroundColor = 'silver';
    nextEl.style.opacity = '.3';



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
    var tt = d3.select("#tooltipdiv")
      .attr("class", "tooltip")
      .style("opacity", 0);


  	//document.getElementById("data").innerHTML = data.avg;
  	d3.select(".chart")
  	.attr("width",frameWidth)
  	.attr("height",frameHeight)
    .attr("viewBox","0 0 800 500")
  	.append("g").attr("transform","translate("+lmargin+","+tmargin+")")
  	.selectAll("rect").data(data)
  	.enter().append("rect")
  	.attr("width",function(d) { return xScale(d.rate);})
  	.attr("height", barThickness)
  	.attr("x",function(d,i) { lmargin; })
  	.attr("y",function(d,i) { return (barThickness+1.0)*i; })
  	.on("mouseover", function(d) {
  		var prem = parseFloat(d.rate);
  		tt.transition()
  				.duration(200)
  				.style("opacity", .9);
  		tt	.html("Family Type: " + d.family_type + "<br/>"  + "Premium: $" + prem.toFixed(2))
  				.style("left", (d3.event.pageX) + "px")
  				.style("top", (d3.event.pageY - 28) + "px");
  		})
  	.on("mouseout", function(d) {
  		tt.transition()
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

    d3.select("#message > p").text(messages_text[scene_num-1]);

  }


}
