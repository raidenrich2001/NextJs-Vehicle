import React, { useState } from "react";
import axios from "./axios/axios";
import '@component/components/css/Styles.css';
import { PiTrash } from 'react-icons/pi';
export default function Addvehicle() {
  const [message, setMessage] = useState();

  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [data, setData] = useState([]);

  function SubmitAddVehicle(e) {
    e.preventDefault();
    try {
      axios
        .post("/api/posts/addvehicle", {
          vehicle_model: vehicleModel,
          vehicle_number: vehicleNumber,
        })
        .then((res) => {
          setMessage(res.data.message);
          setVehicleModel('');
          setVehicleNumber('');
          viewVehicle(e);
        });
    } catch (err) {
      console.log(err);
    }
  }
  function viewVehicle(e) {
    e.preventDefault();
    try {
      axios.get("/api/get/viewvehicles").then((res) => {
        setData(res.data.viewVehicle);
      });
    } catch (err) {
      console.log(err);
    }
  }

  function deleteVehicle(name, id, e) {
    try {
      if (confirm('Are you sure to delete the vehicle ' + name)) {
        axios.delete(`/api/delete/deletevehicle/${id}`).then((res) => {
          alert(res.data.message);
          viewVehicle(e);
        })
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-1 w-2/5 2xs:w-full text-sm">
      <form
        className="flex flex-col gap-5 h-full w-full p-8 bg-white shadow-md rounded-md"
        onSubmit={SubmitAddVehicle}
      >
        <div className="flex justify-between items-center">
          <p className="text-base sm:text-sm xs:text-sm 2xs:text-sm font-semibold text-blue-800">
            Add a New Vehicle
          </p>
          {/* <small className='text-red-500 text-sm'>{error && error}</small> */}
        </div>

        <div>
          <label>Vehicle Model</label>
          <br></br>
          <input
            type="text"
            className="py-1.5 px-2 w-full border  border-blue-300 mt-2"
            onChange={(e) => setVehicleModel(e.target.value)}
            value={vehicleModel}
            required
          ></input>
        </div>
        <div>
          <label>Vehicle Number</label>
          <br></br>
          <input
            type="text"
            className="py-1.5 px-2 w-full border border-blue-300  mt-2"
            onChange={(e) => setVehicleNumber(e.target.value)}
            value={vehicleNumber}
            required
          ></input>
        </div>
        <div className="flex gap-2 justify-end text-xs">
          <button
            type="button"
            className="p-1.5 px-2 rounded bg-blue-600 text-white"
            onClick={viewVehicle}
          >
            View
          </button>
          <button
            type="submit"
            className="p-1.5 px-2 rounded bg-blue-600 text-white"
          >
            Add Vehicle
          </button>
        </div>

        {message === "Successfully Added" ? (
          <small className="text-blue-700">{message}</small>
        ) : (
          <small className="text-red-500">{message}</small>
        )}

        <div>

          {data.length !== 0 && <div className="h-[27vh] overflow-auto barOverflow text-xs">
            <table>
              <thead>
                <tr>
                  <th className="px-2 py-2 border">S.No</th>
                  <th className="px-2 py-2 border">Vehicle Details</th>
                  <th className="px-2 py-2 border">Delete</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((details, index) => (
                  <tr key={details.id}>
                    <td className="px-2 py-2 border">{index + 1}</td>
                    <td className="px-2 py-2 border">{details.vehicle}</td>
                    <td className="px-2 py-2 border" onClick={(e) => deleteVehicle(details.vehicle, details.id, e)}><i><PiTrash></PiTrash></i></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </div>
      </form>
    </div>
  );
}
