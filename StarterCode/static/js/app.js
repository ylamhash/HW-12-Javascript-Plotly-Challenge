function buildMetadata(sample) {
  
    // Use `d3.json` to fetch the metadata for a sample
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata
      panel.html("")
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(data).forEach(([key, value]) => {
  
        // add a new line
        var line = panel.append("p");
        line.text(`${key}: ${value}`);
  
      });
  
    })
  }
  
  function buildCharts(sample) {
  
    d3.json(`/samples/${sample}`).then((data) => {
      
      // Build a Bubble Chart using the sample data
      var bubbleData = [{
        x: data["otu_ids"],
        y: data["sample_values"],
        text: data["otu_labels"], 
        type: "scatter",
        mode: "markers",
        marker: {
          color: data["otu_ids"],
          // symbol: "circle",
          size: data["sample_values"],
        },
      }];
      var bubbleLayout = {
        title: `<b>Biodiversity of sample ${sample}</b>`,
        xaxis: {
          title: "OTU ID",
          // range: [startDate, endDate],
        },
        yaxis: {
          title: "Value",
          // autorange: true,
          range: [0, Math.max(data["sample_values"])]
          // type: "linear"
        }
      };
      var bubble = document.getElementById("bubble");
      Plotly.newPlot(bubble, bubbleData, bubbleLayout);
  
      // Build a Bar Chart
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();