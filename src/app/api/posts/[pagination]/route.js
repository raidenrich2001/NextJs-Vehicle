
import { NextResponse } from "next/server"
import { db } from "@component/utils/db"


export const POST = async ( req, {params}) => {
    try{
        const { pagination } = await params;
        const { model } = await req.json();

        const page = pagination * 10;

        // const vehiclemodels = `SELECT CONCAT('[', GROUP_CONCAT(distinct model ORDER BY model SEPARATOR ','), ']') AS models FROM fleet.pro`;

        const vehiclemodels = `SELECT distinct model FROM fleet.pro`;
        const getvehiclemodels = await new Promise((resolve, reject) => {
          db.query(vehiclemodels, (err, result) => {
              if (err) {
                console.error("Database query error:", err);
                reject(err);
              } else {
                  resolve(result);
              }
            });
          });

        const countquery = `select count(id) as count from fleet.pro ${ model !== 'ALL' ? `WHERE model = '${model}'` : ''}`;
        const getallCount = await new Promise((resolve, reject) => {
          db.query(countquery, (err, result) => {
              if (err) {
                console.error("Database query error:", err);
                reject(err);
              } else {
                resolve(...result);
              }
            });
          });
        const query = `select p.*,d.name from fleet.pro p left join fleet.drivers d on p.user = d.emp_id ${ model !== 'ALL' ? `WHERE model = '${model}'` : ''}  ORDER BY Id DESC limit 10 offset ${page}`;
        const getall = await new Promise((resolve, reject) => {
          db.query(query, (err, result) => {
              if (err) {
                console.error("Database query error:", err);
                reject(err);
              } else if (result.length === 0) {
                console.log("No data not found");
                reject(new Error("No data not found"));
              } else {
                  resolve(result);
              }
            });
          });
       return  NextResponse.json({getall: getall, count: getallCount.count, vehiclemodel: getvehiclemodels}, {status: 201})
       
    }
    catch(err) {
        return  NextResponse.json(err)
    }
}