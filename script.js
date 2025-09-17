// Load the data.json file and inject it into the graph component
fetch("data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load data.json: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    const graph = document.getElementById("graph");
    graph.data = data; // pass JSON to the component
  })
  .catch(error => {
    console.error("Error loading graph data:", error);
  });
