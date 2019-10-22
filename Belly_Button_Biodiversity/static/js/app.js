function buildMetadata(sample) {
  console.log(sample);
  // @TODO: Complete the following function that builds the metadata panel
  var url = "/metadata/"+sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then((response) => {
    var panel = d3.select("#sample-metadata");

    panel.html("");
    var table = panel.append("table")
    var tbody = table.append("tbody");
    
    
    Object.entries(response).forEach(([key, value]) =>{ 
      var row = tbody.append("tr");
      row.append("td").text(key);
      row.append("td").text(value);
    });
    

  });
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var url = "/samples/" + sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {
    console.log(response);
  });
    // @TODO: Build a Bubble Chart using the sample data
  d3.json(url).then(function (response) {
    Object.entries(response).forEach(([key, value]) => {
      var trace1 = {
        labels: response.otu_ids.slice(1, 10),
        values: response.sample_values.slice(1, 10),
        type: "pie"
      };
      var layout1 = {
        title: "Belly Button Cultures"
      }
      var data1 = [trace1];
      Plotly.newPlot("pie", data1, layout1);

      var trace2 = {
        x: response.otu_ids,
        y: response.sample_values,
        text: response.otu_labels,
        mode: "markers",
          marker : {
            size: response.sample_values
          }
      };
      var layout2 = {
        title: "Culture Size by Sample"
        
      };
      var data2 = [trace2];
      
      Plotly.newPlot("bubble", data2, layout2);
    });
  });
  // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
};

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
