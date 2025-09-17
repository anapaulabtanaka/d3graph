fetch("data.json")
  .then(response => response.json())
  .then(raw => {
    // Convert numeric ids to strings (component requires this)
    const nodes = raw.nodes.map(n => ({
      id: String(n.id),
      name: `Node ${n.id}`,
      // You can also pass position if you want fixed layout
      x: n.pos[0],
      y: n.pos[1]
    }));

    const links = (raw.links || []).map(l => ({
      source: String(l.source),
      target: String(l.target)
    }));

    const data = { nodes, links };

    const graph = document.getElementById("graph");
    graph.setAttribute("data", JSON.stringify(data));
  })
  .catch(err => console.error("Error loading graph data:", err));
