import { NextResponse } from "next/server";
import { db } from "@component/utils/db";
import * as XLSX from 'xlsx';

export const POST = async (request, {params}) => {
    try {
        const filtermodel = await request.json()

        const query = `select p.user,p.model,p.startkm,p.endkm,p.start_time,p.end_time,p.place,p.passengers,d.name from fleet.pro p left join fleet.drivers d on p.user = d.emp_id ${ filtermodel.model !== 'ALL' ? `WHERE model = '${filtermodel.model}'` : ''} ORDER BY p.Id DESC;`;
        const filterDataforExcel = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    console.error("Database query error:", err);
                    reject(err);
                } else if (result.length === 0) {
                    resolve(result.length)
                } else {
                    const data = result.map(item => ({
                        ...item,
                        travelkm: item.endkm - item.startkm
                      }));
                    resolve(data)
                }
            });
        });

        const wb = XLSX.utils.book_new();
        
        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet(filterDataforExcel);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Add the worksheet to the workbook
        const headers =  new Headers();

        // set headers
        headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // set headers
        const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Create a Blob from the Excel binary data
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        return new NextResponse(blob, { status: 200, statusText: "OK", headers });
    }
    catch (err) {
        console.log(err)
    }
}