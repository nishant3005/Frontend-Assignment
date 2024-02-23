// Logs.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MimicLogs } from '../api-mimic.js';
import Log from '../components/log/Log.jsx';
import { Line } from 'react-chartjs-2';
import RightArrow from '../assets/right-arrow.png';
import {
  getFomattedTime,
  formattedDate,
  getTimeRangeInMilliseconds,
} from '../helpers/format.js';
import Select from '../components/timeSelect/Select.jsx';

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
        <Select onChange={handleTimeRangeChange} />
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
