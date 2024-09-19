import React, { useState } from 'react';
import './App.css';
import Navbar from './componentes/Navbar.jsx';
import Sidebar from './componentes/Sidebar.jsx';
import Table from './componentes/table.jsx';

const App = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div id="wrapper" className={isSidebarVisible ? '' : 'toggled'}>
      <Sidebar isSidebarVisible={isSidebarVisible} />
      <div id="content-wrapper" className="d-flex flex-column">
        <Navbar toggleSidebar={toggleSidebar} />
        <div id="content">
          <Table />
        </div>
      </div>
    </div>
  );
};

export default App;
