// Create the Metadata card.
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Reference the html element and grab data.
    let dataCard = d3.select("#sample-metadata")
    let metaData = data.metadata.filter(x => x.id === parseInt(sample))[0];
    console.log(metaData);

    // Use `.html("") to clear any existing Metadata.
    dataCard.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metaData).forEach(function(entry) {
      dataCard.append("p").text(`${entry[0].toUpperCase()}: ${entry[1]}`);
      if (entry[0].toUpperCase() != "WFREQ") {
        dataCard.append("hr");
      }
    });

  });
}

// Create a barchart and bubble graph.
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the desired sample.
    let desiredSample = data.samples.filter(x => x.id === sample)[0];

    // Printing as a test.
    console.log(desiredSample);

    // Get the otu_ids, otu_labels, and sample_values.
    let otuIDs = desiredSample.otu_ids;
    let otuLabels = desiredSample.otu_labels;
    let sampleValues = desiredSample.sample_values;

    // Build a Bubble Chart.
    let bubbleTrace = {
      x: otuIDs,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIDs
      },
      text: otuLabels
    };

    // Render the Bubble Chart.
    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: {
        text: 'Bacteria Cultures Per Sample'
      },
      showlegend: false,
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      },
      yaxis: {
        title: {
          text: 'Sample Amount'
        }
      }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build a Bar Chart.
    let barTrace = {
      x: sampleValues.reverse().slice(-10),
      y: otuIDs.reverse().slice(-10).map(x => "OTU " + x),
      text: otuLabels.reverse().slice(-10),
      type: 'bar',
      marker: {
          color: otuIDs.reverse().slice(-10)
      },
      orientation: 'h',
      name: "Bacteria Cultures"
    };

    // Render the Bar Chart.
    let barData = [barTrace];

    let barLayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found"
      },
      showlegend: false,
      xaxis: {
        title: {
          text: "Sample Amount"
        }
      }
    };

    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Initialize the page.
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Grab the names and reference the dropmenu.
    let idList = data.names;
    let dropMenu = d3.select("#selDataset");

    // Append the options to the dropdown menu.
    for (i = 0; i < idList.length; i++) {
      dropMenu.append("option").text(idList[i]).property("value", idList[i]);
    }

    // Initialize page with first sample selected.
    let sample = d3.select("option").property("value");
    buildCharts(sample);
    buildMetadata(sample);
  });
}

// Select menu listener.
function optionChanged(newSample) {
  // Render new information upon selecting an option.
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the page.
init();