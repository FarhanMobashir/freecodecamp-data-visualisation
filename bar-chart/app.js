document.addEventListener("DOMContentLoaded", function () {
  let dataset = fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((res) => res.json())
    .then((dataset) => dataset.data)
    .catch((err) => console.log(err));
  const width = 800,
    height = 400,
    barWidth = width / 275;
  const svgContainer = d3
    .select(".chart")
    .append("svg")
    .attr("height", height + 60)
    .attr("width", width + 100)
    .attr("fill", "grey");
  const overlay = d3
    .select(".chart")
    .append("div")
    .attr("class", "overlay")
    .style("opacity", 0);
  const tooltip = d3
    .select(".chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // data
  dataset.then((data) => {
    console.log(data);
    svgContainer
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -200)
      .attr("y", 80)
      .text("Gross Domestic Product");

    svgContainer
      .append("text")
      .attr("x", width / 2 + 120)
      .attr("y", height + 50);
    // .text("More Information: https://www.bea.gov/national/pdf/nipaguid.pdf");

    const years = data.map((i) => {
      let quarter;
      let temp = i[0].slice(5, 7);
      if (temp === "01") {
        quarter = "Q1";
      } else if (temp === "04") {
        quarter = "Q2";
      } else if (temp === "07") {
        quarter = "Q3";
      } else if (temp === "10") {
        quarter = "Q4";
      }

      return i[0].slice(0, 4) + " " + quarter;
    });
    console.log(years);

    const yearsDate = data.map((i) => {
      return new Date(i[0]);
    });

    const xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);

    // scale
    const xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);

    // xAxis

    const xAxis = d3.axisBottom().scale(xScale);

    svgContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60,400)");

    const GDP = data.map((i) => i[1]);
    const gdpMax = d3.max(GDP);

    // yScale / Linear Scale
    const linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

    let scaledGDP = GDP.map((i) => linearScale(i));
    console.log(scaledGDP);

    // yScale
    const yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

    // yAxis
    const Yaxis = d3.axisLeft(yAxisScale);

    svgContainer
      .append("g")
      .call(Yaxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60,0)");

    d3.select("svg")
      .selectAll("rect")
      .data(scaledGDP)
      .enter()
      .append("rect")
      .attr("data-date", (d, i) => data[i][0])
      .attr("data-gdp", (d, i) => data[i][1])
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(yearsDate[i]))
      .attr("y", (d) => height - d)
      .attr("width", barWidth)
      .attr("height", (d) => d)
      .style("fill", "orange")
      .attr("transform", "translate(60,0)")
      .on("mouseover", function (d, i) {
        // overlay
        //   .transition()
        //   .duration(0)
        //   .style("height", d + "px")
        //   .style("width", barWidth + "px")
        //   .style("opacity", 0.9)
        //   .style("left", i * barWidth + 0 + "px")
        //   .style("top", height - d + "px")
        //   .style("transform", "translateX(60px)");

        tooltip.transition().duration(200).style("opacity", 0.9);

        tooltip
          .html(years[i] + "<br>" + "$" + GDP[i].toFixed(1) + "Billion")
          .attr("data-date", data[i][0])
          .style("left", i * barWidth + 30 + "px")
          .style("top", height - 100 + "px")
          .style("transform", "translateX(60px)");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
        overlay.transition().duration(200).style("opacity", 0);
      });
  });
});
