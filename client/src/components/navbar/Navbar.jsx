import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/TF logo.svg';
import Metrics from '../../assets/metrics-gray.png';
import Logs from '../../assets/list.png';

const Navbar = () => {
  return (
    <div>
      <nav className="bg-[#fff] px-14 py-5 border-b-[1px] border-[#e4ecf6] font-default text-base font-medium">
        <ul className="flex">
          <li className="pr-4">
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </li>
          <li className="mx-3 px-1 hover:border-b-2 border-b-[#5501E1]">
            <Link to="/metrics" className="flex items-center justify-between">
              <img
                src={Metrics}
                alt="metrics"
                className="w-3 h-3 font-[900] mr-1 hover:text-[#2300F7]"
              />
              <span className="text-[#4B5563] hover:text-[#010202]">
                Metrics
              </span>
            </Link>
          </li>
          <li className="mx-4">
            <Link to="/logs" className="flex items-center justify-between">
              <img src={Logs} alt="logs" className="w-3 h-3 font-[900] mr-1" />
              Logs
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
