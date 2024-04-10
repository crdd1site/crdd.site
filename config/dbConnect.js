import mongoose from "mongoose"

mongoose.set('strictQuery', true)

mongoose.connect("mongodb+srv://crddsite:OGcXlBOjjDsUO2DI@cluster0.1giikco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

let db = mongoose.connection;

export default db
