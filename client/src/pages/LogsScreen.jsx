// Logs.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MimicLogs } from '../api-mimic.js';
import Log from '../components/log/Log.jsx';
import { Line } from 'react-chartjs-2';
import RightArrow from '../assets/right-arrow.png';

const LogsScreen = () => {
  const location = useLocation();
  const history = useNavigate();
  const [logs, setLogs] = useState([]);
  const [liveLogsCount, setLiveLogsCount] = useState(0);
  // State for time range filter
  const [timeRange, setTimeRange] = useState('last-5-min');
  const containerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialLogs = await MimicLogs.fetchPreviousLogs({
          startTs: Date.now() - getTimeRangeInMilliseconds(timeRange), // Fetch logs from the last 1 hour
          endTs: Date.now(),
          limit: 1,
        });
        setLogs(initialLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchData();

    // Subscribe to live logs
    const unsubscribe = MimicLogs.subscribeToLiveLogs((newLog) => {
      setLogs((prevLogs) => [...prevLogs, newLog]);
    });

    return () => {
      // Clean up subscription when component unmounts
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Autoscroll if the user is at the latest log
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [logs]);

  useEffect(() => {
    // Update live logs count
    setLiveLogsCount(logs.length);
  }, [logs]);

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
  const getFomattedTime = (time) => {
    let date = new Date(time);
    let hr =
      date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours();
    let min =
      date.getMinutes() < 10
        ? '0' + date.getMinutes().toString()
        : date.getMinutes();
    let formattedTime = `${hr}` + ':' + `${min}`;
    return formattedTime;
  };

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);

    // Update URL with the new time range
    history.push(`/metrics?timeRange=${newTimeRange}`);
  };

  const handleLiveLogsClick = () => {
    // Scroll to the latest logs
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
  };

  // Update URL with logs state
  const updateURL = (filter) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('filter', filter);
    history.push({ search: searchParams.toString() });
  };

  return (
    <div className="font-default text-[12px]">
      <div className="mt-2 flex justify-end items-center pr-6 font-[500]">
        Showing Logs for
        <div className="ml-2 flex justify-center items-center">
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
      <div className="flex flex-col h-screen bg-[#090F17] mx-6 mt-2 mb-12 rounded-lg px-4 pt-10 ">
        <div className="absolute right-6 top-6 text-[#3E5680] font-[500]">
          <select
            name="timeRange"
            id="timeRange"
            onChange={(e) => handleTimeRangeChange(`${e.target.value}`)}
          >
            <option value="last-5-mins">Last 5 mins</option>
            <option value="last-10-mins">Last 10 mins</option>
            <option value="last-15-mins">Last 15 mins</option>
            <option value="last-30-mins">Last 30 mins</option>
            <option value="last-1-hour">Last 1 hour</option>
          </select>
        </div>
        <div className="flex-1 overflow-auto mb-4" ref={containerRef}>
          {logs.map((log, index) => (
            <Log
              key={index}
              timestamp={log.timestamp}
              message={log.message}
              className="mx-4"
            />
          ))}
        </div>
        <div
          className="live-logs-count cursor-pointer text-[#A8C3E8]"
          onClick={handleLiveLogsClick}
        >
          {liveLogsCount} new logs below
        </div>
      </div>
    </div>
  );
};

export default LogsScreen;
