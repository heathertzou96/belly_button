d3.json("data/samples.json").then((data) => {
    
    //dropdown menu to display all the individuals(test IDs) in this study
    var options = d3.select("#selDataset")
        .selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return d;
        });
    
    //console.log(data);
    //console.log(data.samples);
    console.log(data.metadata);
    console.log(data.metadata[0]);

    //DEFAULT DEMOGRAPHIC INFO
    //holds all values for the "metadata" key (in the form of list of dictionaries) and will be used for demographic information
    var metadata = data.metadata;

    function updateDemographic(data) {
        var demographic = d3.select("#sample-metadata").selectAll("ul")
            .data(data);

        demographic.enter()
            .append("ul")
            .merge(demographic)
            .html(function(d) {
                return `<li>id: ${d.id}</li>
                        <li>ethnicity: ${d.ethnicity}</li>
                        <li>gender: ${d.gender}</li>
                        <li>age: ${d.age}</li>
                        <li>location: ${d.location}</li>
                        <li>bbtype: ${d.bbtype}</li>
                        <li>wfreq: ${d.wfreq}</li>
                        `
        });
        demographic.exit().remove();
    }
    
    //holds all values for the "samples" key (in the form of list of dictionaries) and will be used for the horizontal bar and bubble chart
    var samples = data.samples

    //displays default plots: test subject 940 
    //DEFAULT HORIZONTAL BAR CHART
    var x = data.samples[0].sample_values.slice(0,10).reverse();
    x = x.map(function(sample) {
        //console.log(sample);
        return sample; 
    })
    
    var y = data.samples[0].otu_ids.slice(0,10).reverse();
    y = y.map(function(sample) {
        //console.log(`OTU ${sample}`);
        return `OTU ${sample}`;
    });

    var hover = data.samples[0].otu_labels.slice(0,10).reverse();
    hover = hover.map(function(sample) {
        //console.log(sample);
        return sample;
    })

    //DEFAULT BUBBLE CHART
    var x_bubble = data.samples[0].otu_ids;
    x_bubble = x_bubble.map(sample => sample);
    //console.log(x);

    var y_bubble = data.samples[0].sample_values;
    y_bubble = y_bubble.map(sample => sample);
    //console.log(y);

    var marker_size = data.samples[0].sample_values;
    marker_size = marker_size.map(sample => sample);
    //console.log(marker_size);

    var marker_color = data.samples[0].otu_ids;
    marker_color = marker_color.map(sample => sample)

    var text_values = data.samples[0].otu_labels;
    text_values = text_values.map(sample => sample);

    function init() {

        //HORIZONTAL BAR CHART
        var data = [{
            x: x,
            y: y,
            text: hover,
            type: "bar",
            orientation: "h"

        }];
        Plotly.newPlot("bar", data)

        //BUBBLE CHART
        var trace = {
            x: x_bubble,
            y: y_bubble,
            mode: 'markers',
            marker: {
                size: marker_size,
                color: marker_color
            },
            text: text_values
        };

        var bubble_data = [trace];

        var layout = {
            xaxis: {
                title: "OTU ID",
            },    
        };
        Plotly.newPlot("bubble", bubble_data, layout);

        //DEFAULT DEMOGRAPHIC INFO
        var demographic940 = [metadata[0]];
        updateDemographic(demographic940);
    }

    //on change to the DOM, call optionChanged()
    d3.selectAll("#selDataset").on("change", optionChanged);
    
    function optionChanged() {
        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.property("value");

        //UPDATE DEMOGRAPHIC INFO
        metadata.forEach((subject) => {
            
            if (dataset == subject.id) {
                var demographic_info = [subject];
                console.log(demographic_info);
                updateDemographic(demographic_info);
            }
            
        });

        //UPDATE BAR AND BUBBLE CHART
        samples.forEach((sample) => {
           
            if (dataset == sample.id) {

                //HORIZONTAL BAR CHART
                var x = sample.sample_values.slice(0,10).reverse();
                x = x.map(function(sample) {
                    //console.log(sample);
                    return sample; 
                })
                
                var y = sample.otu_ids.slice(0,10).reverse();
                y = y.map(function(sample) {
                    //console.log(`OTU ${sample}`);
                    return `OTU ${sample}`;
                });
                
                var hover = sample.otu_labels.slice(0,10).reverse();
                hover = hover.map(function(sample) {
                    //console.log(sample);
                    return sample;
                })

                //BUBBLE CHART
                var x_bubble = sample.otu_ids;
                x_bubble = x_bubble.map(sample => sample);
                //console.log(x);

                var y_bubble = sample.sample_values;
                y_bubble = y_bubble.map(sample => sample);
                //console.log(y);

                var marker_size = sample.sample_values;
                marker_size = marker_size.map(sample => sample);
                //console.log(marker_size);

                var marker_color = sample.otu_ids;
                marker_color = marker_color.map(sample => sample);

                var text_values = sample.otu_labels;
                text_values = text_values.map(sample => sample);
               
            }
        
            Plotly.restyle("bar", "x", [x]);
            Plotly.restyle("bar", "y", [y]);
            Plotly.restyle("bar", "text", [hover]);

            Plotly.restyle("bubble", "x", [x_bubble]);
            Plotly.restyle("bubble", "y", [y_bubble]);
            Plotly.restyle("bubble", "marker.size", [marker_size]);
            Plotly.restyle("bubble", "marker.color",[marker_color]);
            Plotly.restyle("bubble", "text", [text_values]);    

        });

    }

    init();

});

