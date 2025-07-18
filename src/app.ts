import express, { Application, Request, Response } from 'express'
import mongoose, { Schema } from 'mongoose'
import { booksRouter } from './app/controllers/books.controller'
import { usersRouter } from './app/controllers/users.controller'
const morgan = require('morgan')
const cors = require('cors')

const app: Application = express()

// middleware 
app.use(express.json())
app.use(morgan("dev"))
app.use(
    cors({
        origin:[
            "http://localhost:5173",
            "https://libra-nova.netlify.app"
        ],
        credentials:true
    })
)

// controllers 
app.use("/api/books",booksRouter)
app.use("/api/users",usersRouter)


app.get('/', (req: Request, res: Response) => {
    res.json({
        status: true,
        message: "Server Working Finely 🎉"
    })
})



export default app
