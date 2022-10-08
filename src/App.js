import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton, Form, Table } from 'react-bootstrap';
import './App.css'
import UserData from './components/UserData';
import axios from 'axios';
import NoDatafound from './components/NoDatafound';
import { BsPrinter, BsFilePdf } from 'react-icons/bs';
import { GrDocumentCsv } from 'react-icons/gr';
import { AiOutlineFileExcel } from 'react-icons/ai';
import ReactToPrint from 'react-to-print';
import { jsPDF } from "jspdf";
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import autoTable from 'jspdf-autotable';


const App = () => {

  const tableRef = useRef(null);
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");

  // get data from json placeholder
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response) => setUserData(response.data))
      .catch((error) => {
        console.log(error);
      });
  }, [])

  // debouncing
  const debounceHandler = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doSearch = (value) => {
    setSearch(value)
  };

  // search user by email or name
  const allUsersData = useMemo(() => {
    let computedUsers = userData;
    if (search) {
      computedUsers = computedUsers.filter(
        user =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    return computedUsers;
  }, [search, userData]);

  const handleSearch = debounceHandler(doSearch, 500);

  const table = document.getElementById('exportTable');

  // export pdf
  const doc = new jsPDF();
  const exportPDF = () => {
    autoTable(doc, { html: '#exportTable' })
    doc.save('Users.pdf')
  }

  // export csv
  const exportCSV = () => {
    // Export to csv
    const csv = toCsv(table);
    // Download it
    download(csv, 'Users.csv');
  };

  const toCsv = function (table) {
    // Query all rows
    const rows = table.querySelectorAll('tr');

    return [].slice
      .call(rows)
      .map(function (row) {
        // Query all cells
        const cells = row.querySelectorAll('th,td');
        return [].slice
          .call(cells)
          .map(function (cell) {
            return cell.textContent;
          })
          .join(',');
      })
      .join('\n');
  };

  const download = function (text, fileName) {
    const link = document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='container my-3'>


      {/* table top section */}
      <div className="row">
        <h3>All User List</h3>
        {/* export option */}
        <div className="col-sm-4 col-md-6">
          <div>
            <DropdownButton id="dropdown-button" title="Export">
              <Dropdown.Item >
                <div className="other-button" onClick={() => exportCSV()} id="export">
                  <GrDocumentCsv />
                  <span className="ms-1"> CSV</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item >
                <div className="other-button" onClick={() => exportPDF()}>
                  <BsFilePdf />
                  <span className="ms-2">PDF</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item >
                <span>
                  < AiOutlineFileExcel />
                </span>
                <ReactHtmlTableToExcel
                  id="tasks-table-xls-button"
                  className="excel-button"
                  table="exportTable"
                  filename="Users"
                  sheet="Users"
                  buttonText="Excel"
                />
              </Dropdown.Item>
              <Dropdown.Item className="">
                <ReactToPrint
                  trigger={() => <div className="other-button">
                    <BsPrinter />
                    <span className="ms-2">Print</span>
                  </div>}
                  content={() => tableRef.current}
                />
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>

        {/* search option */}
        <div className="col-sm-8 col-md-6">
          <Form className='d-flex justify-content-end'>
            <Form.Group className="mb-3 w-50" controlId="formBasicEmail">
              <Form.Control type="text" placeholder="Search by name or email" onChange={(e) =>
                handleSearch(e.target.value)
              } />
            </Form.Group>
          </Form>
        </div>
      </div>

      {/* main table */}
      <Table responsive striped bordered hover ref={tableRef} id="exportTable">
        {/* table header */}
        <thead className="bg-primary">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Company Name</th>
            <th>Zipcode</th>
          </tr>
        </thead>

        <tbody>
          {/* if data then show  */}
          {
            allUsersData?.map((user) => <UserData key={user.id} user={user} />)
          }

        </tbody>
        {
          allUsersData.length > 0 &&
          <tfoot >
            <p className='fw-bold'>{allUsersData.length} user found</p>
          </tfoot>
        }
      </Table>


      {
        allUsersData.length === 0 &&
        <NoDatafound />
      }

    </div>
  );
};

export default App;