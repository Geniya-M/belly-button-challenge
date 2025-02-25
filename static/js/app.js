// Build the metadata panel
function buildMetadata(sample) {
  let Menu = d3.select("#selDataset");

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let IDs = data.names;

    for (let i = 0; i < IDs.length; i++) {
      Menu
        .append("option")
        .text(IDs[i])
        .property("value", IDs[i]);
    }

    let sampIDs = IDs[0];
    createCharts(sampIDs);
    populateMetadata(sampIDs);
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let allSamps = data.samples;


    // Filter the samples for the object with the desired sample number
    let filtered = allSamps.filter(sampleObj => sampleObj.id == selectSamp);
    let sampData = filtered[0];


    // Get the otu_ids, otu_labels, and sample_values
    let otuIDs = sampData.otu_ids;
    let otuLabels = sampData.otu_labels;
    let sampVal = sampData.sample_values;


    // Build a Bubble Chart
    let bubbleChart = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria"}
    };


    // Render the Bubble Chart
    let bubbleInfo = [
      {
        x: otuIDs,
        y: sampVal,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampVal,
          color: otuIDs,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleInfo, bubbleChart);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let Ticks = otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barChart = [
      {
        y: Ticks,
        x: sampVal.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    // Render the Bar Chart
    let barInfo = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barInfo, barChart);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let metaArray = data.metadata;
    let filteredMeta = metaArray.filter(sampleObj => sampleObj.id == selectSamp);
    let sampleMeta = filteredMeta[0];


    // Use d3 to select the dropdown with id of `#selDataset`
    let metaPanel = d3.select("#sample-metadata");
    metaPanel.html("");

    // Use the list of sample names to populate the select options
    for (let key in sampleMeta) {
      metaPanel.append("h6").text(`${key.toUpperCase()}: ${sampleMeta[key]}`);
    }
  });
}

// Function for event listener
function optionChanged(newSelection) {
  // Build charts and metadata panel each time a new sample is selected
  createCharts(newSelection);
  populateMetadata(newSelection);

}

// Initialize the dashboard
init();
