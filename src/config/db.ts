import mongoose from "mongoose";

export default async function estabishConnection (url: string){
    try{
        await mongoose.connect(url)
    }catch(err){
        console.error("error happend when start a db connection")
        process.exit(1)
    }
    const connection = mongoose.connection
    connection.on('open', () => {
        console.log("DataBase start the connection")
    })
    connection.on('error', (err) => {
        console.error('error happend in database :', err)
    })
}