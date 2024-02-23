import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useLocation, useNavigate } from 'react-router-dom';
import { MimicMetrics } from '../api-mimic.js';
import RightArrow from '../assets/right-arrow.png';
import { formattedDate, getFomattedTime } from '../helpers/format.js';
import Select from '../components/timeSelect/Select.jsx';

const MetricsScreen = () => {
  const location = useLocation();
  const history = useNavigate();

  // State for chart data
  const [chartData, setChartData] = useState([]);

  // State for time range filter
  const [timeRange, setTimeRange] = useState('last-5-min');

  // State to store chart instances
  const [chartInstances, setChartInstances] = useState([]);

  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });

  // Fetch and update chart data based on time range
  useEffect(() => {
    // Fetch data based on timeRange using MimicMetrics
    const fetchData = async () => {
      try {
        const data = await MimicMetrics.fetchMetrics({
          startTs: Date.now() - getTimeRangeInMilliseconds(timeRange),
          endTs: Date.now(),
        });
        setChartData(data);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };

    fetchData();
  }, [timeRange]);

  // Handle URL update on time range change
  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);

    // Update URL with the new time range
    history.push(`/metrics?timeRange=${newTimeRange}`);
  };

  // Helper function to convert time range string to milliseconds
  const getTimeRangeInMilliseconds = (range) => {
    switch (range) {
      case 'last-5-mins':
        return 5 * 60 * 1000;
      case 'last-10-mins':
        return 10 * 60 * 1000;
      case 'last-15-mins':
        return 15 * 60 * 1000;
      case 'last-30-mins':
        return 30 * 60 * 1000;
      case 'last-1-hour':
        return 60 * 60 * 1000;
      default:
        return 5 * 60 * 1000; // Default to 1 hour if an invalid range
    }
  };

  const formattedDate = (time) => {
    let date = new Date(time);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    // Store the references to the created charts
    const color = ['#00FF00', '#0000FF', '#FF0000'];
    const datasets = chartData.map((line, j) => {
      console.log(chartData);
      let dataset = [];
      for (let i = 0; i < line.graphLines.length; i++) {
        const graphLine = line.graphLines[i];
        dataset.push({
          label: graphLine.name,
          data: graphLine.values.map((entry) => {
            return {
              x: entry.timestamp,
              y: entry.value,
            };
          }),
          fill: j === 3 ? true : false,
          borderColor: j == 3 ? color[i + 1] : color[i],
          borderCapStyle: 'round',
          tension: 0.1,
          backgroundColor: j == 3 ? `${color[i + 1]}20` : color[i],
          borderWidth: 2,
          pointRadius: 0,
        });
      }
      return {
        datasets: dataset,
        name: line.name,
      };
    });
    console.log(datasets);
    // Update the chartInstances state
    setChartInstances(datasets);
  }, [chartData]);

  const handleChartClick = (element) => {
    if (element.length > 0) {
      const datasetIndex = element[0]._datasetIndex;
      const dataIndex = element[0]._index;
      const label = graphLines[datasetIndex].labels[dataIndex];

      // Set selected range and update URL
      setSelectedRange({ start: label, end: label });
      updateUrl({ start: label, end: label });
    }
  };
  const handleDragEnd = () => {
    // Fetch logs for the selected time range
    console.log('Fetching logs for time range:', selectedRange);
  };

  return (
    <div className="p-6 bg-[#d9e4f4] font-default">
      <div className="flex p-4 rounded-t-lg bg-[#fff] border-[1px] border-b-0 border-[#a5c1e6] items-center">
        <h1 className="text-2xl font-medium text-[#010202]">Metrics</h1>
        <div className="ml-2 flex justify-center items-center font-default text-[12px] font-[500]">
          {formattedDate(Date.now() - getTimeRangeInMilliseconds(timeRange))}
          <div className="ml-2">
            {getFomattedTime(
              Date.now() - getTimeRangeInMilliseconds(timeRange)
            )}
          </div>
          <img src={RightArrow} alt="right-arrow" className="w-4 h-4 mx-2" />
          {formattedDate(Date.now())}
          <div className="ml-2"> {getFomattedTime(Date.now())}</div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="rounded-b-lg border-[1px] border-[#a5c1e6] font-default text-[12px] text-[#3E5680] font-[500]">
        <Select onChange={handleTimeRangeChange} />
        <div className="grid md:grid-cols-2 grid-cols-1 justify-between items-center p-4">
          {chartInstances &&
            chartInstances.map((chart, i) => (
              <>
                <div className="rounded-lg bg-[#fff] border-[1px] border-[#a5c1e6] p-6 grow m-2">
                  <Line
                    key={i}
                    data={chart}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: chart.name,
                          position: 'top',
                          align: 'start',
                        },
                        legend: {
                          display: true,
                          align: 'start',
                          position: 'bottom',
                          backgoundColor: 'red',
                          fontWeight: 'bold',
                          labels: {
                            boxWidth: 15,
                          },
                        },
                      },

                      scales: {
                        x: {
                          type: 'linear',
                          position: 'bottom',
                          ticks: {
                            callback: (value) => getFomattedTime(value),
                          },
                        },
                        y: {
                          type: 'linear',
                          position: 'right',
                        },
                      },
                      onClick: (event, elements) => {
                        console.log(event, elements);
                        const clickedDatasetIndex = elements[0].datasetIndex;
                        const clickedPointIndex = elements[0].index;
                        const clickedValue =
                          chart.datasets[clickedDatasetIndex].data[
                            clickedPointIndex
                          ];

                        // Do something with the clicked data, e.g., show a tooltip or handle the selection
                        console.log(
                          'Clicked dataset index:',
                          clickedDatasetIndex
                        );
                        console.log('Clicked point index:', clickedPointIndex);
                        console.log('Clicked value:', clickedValue);
                      },
                      onDragEnd: handleDragEnd,
                    }}
                  />
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsScreen;
