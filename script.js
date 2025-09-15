const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

d3.json("data.json").then(function(graph) {
  const simulation = d3.forceSimulation(graph.nodes)
      .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

  const node = svg.append("g")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 10)
      .attr("fill", "steelblue")
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  const label = svg.append("g")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
      .text(d => d.id)
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", 4);

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
});
