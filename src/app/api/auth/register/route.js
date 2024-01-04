import connect from "@component/utils/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import User from "@component/models/User";
export const POST = async ( request ) => {
    const {name, email, password} = await request.json();
    await connect();

    const hashedPassword = bcrypt.hashSync(password, 5)
    const newUser = new User(
        {
            name,
            email,
            password: hashedPassword
        }
    )
    try{
        await newUser.save()
        return new NextResponse("User has been created",{
            status: 201
        })
    }catch(err){
        return new NextResponse(err.message, {
            status: 500
        });
    }
}