import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  async function closeTicket(ticketID) {
    console.log("Clossing Ticket", ticketID);
    let apiURL = `http://localhost:3000/api/tickets/${ticketID}/status`;

    const response = await fetch(apiURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "closed",
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const updatedItem = await response.json();
    console.log("Updated item:", updatedItem);
    fetchRecords();
    //
  }

  function fetchRecords() {
    let queryURL =
      "http://localhost:3000/api/tickets?status=" +
      status +
      "&priority=" +
      priority +
      "&q=" +
      query +
      "&page=" +
      page +
      "&limit=" +
      limit;

    console.log(queryURL);
    fetch(queryURL)
      .then((response) => response.json())
      .then((data) => setData(data.data))
      .catch((error) => console.error("Error fetching tickets:", error));
  }

  useEffect(() => {
    fetchRecords();
  }, [status, priority, query, page, limit]);

  function updateQuery(parameter, value) {
    console.log("Value ::", parameter, value);
    if (parameter == "status") {
      setStatus(value);
      console.log("Status ::", status);
    }
    if (parameter == "priority") {
      setPriority(value);
      console.log("Priority ::", priority);
    }
    if (parameter == "query") {
      setQuery(value);
      console.log("Query ::", query);
    }
  }
  return (
    <>
      <h1>Ticket Management</h1>
      Filter By Status ::{" "}
      <select
        onChange={(event) => {
          updateQuery("status", event.target.value);
        }}
      >
        <option value="">All</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
      <br />
      Filter By Priority ::{" "}
      <select
        onChange={(event) => {
          updateQuery("priority", event.target.value);
        }}
      >
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <br />
      Search Task ::{" "}
      <input
        type="text"
        onChange={(event) => updateQuery("query", event.target.value)}
      />
      <table className="TableDiv">
        <thead>
          <tr>
            <th>Title</th>
            <th>Prority</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.title}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.status}</td>
              <td>{ticket.createdAt}</td>
              <td>
                {ticket.status == "open" ? (
                  <button onClick={() => closeTicket(ticket._id)}>Close</button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={()=>{setPage(page-1)}}>Prev</button>
      <button onClick={()=>{setPage(page+1)}}>Next</button>
    </>
  );
}

export default App;
