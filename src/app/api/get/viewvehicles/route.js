import { NextResponse } from "next/server"
import { db } from "@component/utils/db"

export const GET = async ( request ) => {
    try {

        const query = `select * from fleet.vehicle_details`
        const viewVehicle = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })
        // console.log(viewVehicle)
        return NextResponse.json({viewVehicle:viewVehicle}, {status: 201})    
    }
    catch(err) {
        return NextResponse.json({message: err}, { status : 500 })
    }
}