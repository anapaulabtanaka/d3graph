// script.js
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

// Load the graph.json file
d3.json("graph.json").then(graph => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const simulation = d3.forceSimulation(graph.nodes)
    .force("link", d3.forceLink(graph.links).id(d => d.id).distance(50))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
    .selectAll("line")
    .data(graph.links)
    .join("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6);

  const node = svg.append("g")
    .selectAll("circle")
    .data(graph.nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", d => color(d.group || "default"))
    .call(drag(simulation));

  const label = svg.append("g")
    .selectAll("text")
    .data(graph.nodes)
    .join("text")
    .text(d => d.id)
    .attr("x", 6)
    .attr("y", 3);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  function drag(simulation) {
    return d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }
});
