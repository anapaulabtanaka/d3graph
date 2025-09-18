const svg = d3.select("svg");
const width = window.innerWidth;
const height = window.innerHeight;

const g = svg.append("g"); // group for zoom/pan

// Enable zoom & pan
svg.call(
  d3.zoom().on("zoom", (event) => {
    g.attr("transform", event.transform);
  })
);

// Load JSON graph
d3.json("data.json").then((graph) => {
  const simulation = d3
    .forceSimulation(graph.nodes)
    .force(
      "link",
      d3
        .forceLink(graph.links)
        .id((d) => d.id)
        .distance(120)
        .strength(0.5)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "collide",
      d3
        .forceCollide()
        .radius((d) => d.r + 4)
        .strength(1)
        .iterations(2)
    )
    .on("tick", ticked);

  // Links
  const link = g
    .append("g")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", 2);

  // Nodes
  const node = g
    .append("g")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => d.r * 2)
    .attr("fill", "steelblue")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  // Labels
  //const label = g
  //  .append("g")
  //  .selectAll("text")
  //  .data(graph.nodes)
  //  .enter()
  //  .append("text")
  //  .text((d) => d.id)
  //  .attr("dx", (d) => d.r + 4)
  //  .attr("dy", 4);

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

  //  label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}); // end d3.json
