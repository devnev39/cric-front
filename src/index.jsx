import React from 'react';
import ReactDOM from 'react-dom/client';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import Navbar from './Navbar';
import {BrowserRouter} from 'react-router-dom';
import './styles.css';
import {Chart, registerables} from 'chart.js';
import {Dropdown, Collapse, initMDB} from 'mdb-ui-kit';
initMDB({Dropdown, Collapse});
Chart.register(...registerables);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
      <Navbar />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </>,
);
