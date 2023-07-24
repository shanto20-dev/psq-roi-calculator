import "./styles.css";
import React, { useState, useEffect } from "react";
import DataVisualizationD3 from "./DataVisualizationD3";

export default function RoiPage() {
  // Revenue Increase - Utilization
  const [internalResources, setInternalResources] = useState(400);
  const [externalResources, setExternalResources] = useState(50);
  const [averageBillableHoursPerResource, setAverageBillableHoursPerResource] =
    useState(130);
  const [averageHourlyRate, setAverageHourlyRate] = useState(225);
  const [assumedIncreaseInUtilization, setAssumedIncreaseInUtilization] =
    useState(1);

  // Cost Avoidance - Seller Efficiency
  const [averageSellerSalary, setAverageSellerSalary] = useState(120000);
  const [averageTimeSpentSOW, setAverageTimeSpentSOW] = useState(16);
  const [SOWSPerMonth, setSOWSPerMonth] = useState(200);
  const [psqIncreasedEfficiency, setPsqIncreasedEfficiency] = useState(25);

  const [revenueIncreaseMonthly, setRevenueIncreaseMonthly] = useState(0);
  const [revenueIncreaseYearly, setRevenueIncreaseYearly] = useState(0);
  const [costAvoidance, setCostAvoidance] = useState(0);
  const [costAvoidanceYearly, setCostAvoidanceYearly] = useState(0);

  const [bottomLineMonthly, setBottomLineMonthly] = useState(0);
  const [bottomLineYearly, setBottomLineYearly] = useState(0);

  const [revenueIncreaseMonthlyFormatted, setRevenueIncreaseMonthlyFormatted] =
    useState(0);
  const [revenueIncreaseYearlyFormatted, setRevenueIncreaseYearlyFormatted] =
    useState(0);
  const [costAvoidanceFormatted, setCostAvoidanceFormatted] = useState(0);
  const [costAvoidanceYearlyFormatted, setCostAvoidanceYearlyFormatted] =
    useState(0);
  const [bottomLineYearlyFormatted, setBottomLineYearlyFormatted] = useState(0);

  const calculateRevenueIncrease = () => {
    // Calculate Revenue Increase by multiplying Total Billable Hours by Average Hourly Rate by Assumed Increase in Utilization

    const totalBillableHours =
      (internalResources + externalResources) * averageBillableHoursPerResource;
    const revenueIncreaseMonthly =
      totalBillableHours *
      averageHourlyRate *
      (assumedIncreaseInUtilization / 100);
    const revenueIncreaseYearly = revenueIncreaseMonthly * 12;

    // format the revenue increase to have commas

    setRevenueIncreaseMonthly(revenueIncreaseMonthly);
    setRevenueIncreaseYearly(revenueIncreaseYearly);
  };

  const calculateCostAvoidance = () => {
    // Calculate Cost Avoidance
    const avgSellerHourlyCostRate = averageSellerSalary / 2080;
    const timeSavingsPerSOW =
      averageTimeSpentSOW * (psqIncreasedEfficiency / 100);
    const timeSavingsMonthly = timeSavingsPerSOW * SOWSPerMonth;
    const costAvoidance = timeSavingsMonthly * avgSellerHourlyCostRate;
    //Round the cost avoidance to the nearest dollar
    const costAvoidanceRounded = Math.round(costAvoidance);
    const costAvoidanceYearly = costAvoidanceRounded * 12;

    setCostAvoidance(costAvoidanceRounded);
    setCostAvoidanceYearly(costAvoidanceYearly);
  };

  const calculateBottomLine = () => {
    // Calculate Bottom Line Impact
    const bottomLineMonthly = revenueIncreaseMonthly + costAvoidance;
    const bottomLineYearly = bottomLineMonthly * 12;

    setBottomLineMonthly(bottomLineMonthly);
    setBottomLineYearly(bottomLineYearly);
    formatNumber(bottomLineYearly);
  };

  const calculate = () => {
    calculateRevenueIncrease();
    calculateCostAvoidance();
  };

  useEffect(() => {
    calculateBottomLine();
    setupChart();
  }, [revenueIncreaseMonthly, costAvoidance]);

  useEffect(() => {
    calculate();
  }, [
    internalResources,
    externalResources,
    averageBillableHoursPerResource,
    averageHourlyRate,
    assumedIncreaseInUtilization,
    averageSellerSalary,
    averageTimeSpentSOW,
    SOWSPerMonth,
    psqIncreasedEfficiency,
  ]);

  // format the Bottom Line Yearly to have commas
  const formatNumber = (number) => {
    setBottomLineYearlyFormatted(number.toLocaleString());
  };

  // format to have commas
  useEffect(() => {
    setRevenueIncreaseMonthlyFormatted(revenueIncreaseMonthly.toLocaleString());
    setRevenueIncreaseYearlyFormatted(revenueIncreaseYearly.toLocaleString());
    setCostAvoidanceFormatted(costAvoidance.toLocaleString());
    setCostAvoidanceYearlyFormatted(costAvoidanceYearly.toLocaleString());
  }, [
    revenueIncreaseMonthly,
    revenueIncreaseYearly,
    costAvoidance,
    costAvoidanceYearly,
  ]);

  const [chartData, setChartData] = useState({
    labels: ["Revenue Increase", "Cost Avoidance"],
    values: [revenueIncreaseYearly, costAvoidanceYearly],
  });

  const setupChart = () => {
    const newlySetChartData = {
      labels: ["Revenue Increase", "Cost Avoidance"],
      values: [revenueIncreaseYearly, costAvoidanceYearly],
    };
    setChartData(newlySetChartData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "internalResources":
        setInternalResources(value);
        break;
      case "externalResources":
        setExternalResources(value);
        break;
      case "avgBillHours":
        setAverageBillableHoursPerResource(value);
        break;
      case "averageHourlyRate":
        setAverageHourlyRate(value);
        break;
      case "assumedIncreaseUtilization":
        setAssumedIncreaseInUtilization(value);
        break;
      case "averageSellerSalary":
        setAverageSellerSalary(value);
        break;
      case "averageTimeSpentSOW":
        setAverageTimeSpentSOW(value);
        break;
      case "SOWSPerMonth":
        setSOWSPerMonth(value);
        break;
      case "psqIncreasedEfficiency":
        setPsqIncreasedEfficiency(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>PSQuote ROI Calculator</h1>
        <p>Check out the impact that PSQuote can have on your business.</p>
      </div>
      <div className="calculator">
        <div className="inputs">
          {/* Rev Increase */}
          <div className="utilizationInputs">
            <h2>Revenue Increase from Improved Utilization</h2>
            <div className="inputRow">
              <h3>Number of Internal Billable Resources</h3>
              <input
                onChange={handleChange}
                value={internalResources}
                name="internalResources"></input>
            </div>
            <div className="inputRow">
              <h3>Number of External Billable Resources</h3>
              <input
                onChange={handleChange}
                value={externalResources}
                name="externalResources"></input>
            </div>
            <div className="inputRow">
              <h3>Average Billable Hours per Resource</h3>
              <input
                onChange={handleChange}
                value={averageBillableHoursPerResource}
                name="avgBillHours"></input>
            </div>
            <div className="inputRow">
              <h3>Average Hourly Rate</h3>
              <input
                onChange={handleChange}
                value={averageHourlyRate}
                name="averageHourlyRate"></input>
            </div>
            <div className="inputRow">
              <h3>Assumed Increase in Utilization from Using PSQuote</h3>
              <input
                onChange={handleChange}
                value={assumedIncreaseInUtilization}
                name="assumedIncreaseUtilization"></input>
              %
            </div>
          </div>
          {/* Cost Avoidance */}
          <div className="salesInputs">
            <h2>Sales Cost Avoidance from Improved Efficiency</h2>
            <div className="inputRow">
              <h3>Average Seller Salary</h3>
              <input
                onChange={handleChange}
                value={averageSellerSalary}
                name="averageSellerSalary"></input>
            </div>
            <div className="inputRow">
              <h3>Average Time Spent on Creating a Custom SOW</h3>
              <input
                onChange={handleChange}
                value={averageTimeSpentSOW}
                name="averageTimeSpentSOW"></input>
            </div>
            <div className="inputRow">
              <h3>Number of SOWs Created per Month</h3>
              <input
                onChange={handleChange}
                value={SOWSPerMonth}
                name="SOWSPerMonth"></input>
            </div>
            <div className="inputRow">
              <h3>Assumed Increase in Efficiency from Using PSQuote</h3>
              <input
                onChange={handleChange}
                value={psqIncreasedEfficiency}
                name="psqIncreasedEfficiency"></input>
              %
            </div>
          </div>
        </div>
        <div className="output">
          <div className="bottom-line">
            <h2>Annual Bottom Line Impact: </h2>
            <h1>${bottomLineYearlyFormatted}</h1>
          </div>
          <div className="chart">
            <DataVisualizationD3 chartData={chartData} />
          </div>
          <div className="outputText">
            <div className="RevenueSection">
              <h3>Revenue Increase with PSQuote</h3>
              <div>Per Month: ${revenueIncreaseMonthlyFormatted}</div>
              <div>Per Year: ${revenueIncreaseYearlyFormatted}</div>
            </div>
            <div className="CostSection">
              <h3>Cost Avoidance with PSQuote</h3>
              <div>Per Month: ${costAvoidanceFormatted}</div>
              <div>Per Year: ${costAvoidanceYearlyFormatted}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
