import { NextResponse } from "next/server"
import { db } from "@component/utils/db"

export const POST = async ( request ) => {
    try {
        const { vehicle_model, vehicle_number} = await request.json();
        const vehicle = vehicle_model +'-'+vehicle_number

        const query = `INSERT INTO vehicle_details (vehicle) values ('${vehicle}')`
        const addVehicle = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })
        try{
            if(addVehicle){
                return NextResponse.json({message:'Successfully Added'}, {status: 201})    
            }
        }
        catch(err){
            return NextResponse.json({message: err}, { status : 500 })
        }
    }
    catch(err) {
        return NextResponse.json({message: err}, { status : 500 })
    }
}