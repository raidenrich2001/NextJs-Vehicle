import { NextResponse } from "next/server";
import { db } from "@component/utils/db";

export const DELETE = async ( request, { params } ) => {
    const { id } = params
    try{
        const query = `delete from fleet.pro where id = ${id}`;

        const deleteVehicle = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    console.error("Database query error:", err);
                    reject(err);
                } else {
                    resolve(result);
                }
              });
            });
            if(deleteVehicle){
                return  NextResponse.json({message:'Deleted Successfully'}, {status: 201})
            }
    }
    catch(err){
        console.log('Errrorrr: ', err)
    }
}   