import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";

const DataVisualizationD3 = ({ chartData }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartData) {
      // Clear any existing content in the chart container
      d3.select(chartRef.current).selectAll("*").remove();

      // Set up chart dimensions
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      // Create the SVG element
      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Data in a stacked format
      const data = [
        {
          label: chartData.labels,
          revenueIncrease: chartData.values[0],
          costAvoidance: chartData.values[1],
        },
      ];

      // Create a stacked data structure

      const stack = d3.stack().keys(["revenueIncrease", "costAvoidance"])(data);

      // Create scales
      const xScale = d3.scaleBand().range([0, width]).padding(0.1);
      const yScale = d3.scaleLinear().range([height, 0]);

      // Update scales' domains based on data
      xScale.domain(data.map((d) => d.label));
      yScale.domain([0, data[0].costAvoidance + data[0].revenueIncrease]);

      // Create and append the stacked bars to the chart
      const bars = svg
        .append("g")
        .selectAll(".bar")
        .data(stack)
        .enter()
        .append("g")
        .attr("fill", (d) =>
          d.key === "revenueIncrease" ? "#bd7ebe" : "#8bd3c7"
        )
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.data.label))
        .attr("y", yScale(0)) // Start from the bottom
        .attr("height", 0) // Initially height is 0
        .attr("width", xScale.bandwidth());

      // Add tooltips
      const tip = d3Tip()
        .attr("class", "d3-tip")
        .html((data) => {
          // Check if data is defined and contains the required keys
          if (data) {
            const tooltipContent =
              data[0] === 0 ? "Revenue Increase" : "Cost Avoidance";
            return `<span>${tooltipContent}: $${(
              data[1] - data[0]
            ).toLocaleString()}</span>`;
          }
          return "";
        })
        .direction("n")
        .offset([-10, 0]);

      bars.call(tip);
      bars
        .on("mouseover", (event, data) => tip.show(data, event.target))
        .on("mouseout", tip.hide);

      bars
        .transition()
        .duration(1000) // Transition duration in milliseconds
        .delay((d, i) => i * 100) // Add a slight delay for a cascading effect
        .attr("y", (d) => yScale(d[1])) // Set the top position
        .attr("height", (d) => yScale(d[0]) - yScale(d[1])); // Set the height
    }
  }, [chartData]);

  return <div ref={chartRef} />;
};

export default DataVisualizationD3;
