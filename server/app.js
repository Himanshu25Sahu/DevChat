import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser';
import session from 'express-session';
export const app=express();
import { expressRouter } from './routes/authRoutes.js';
import { postRouter } from './routes/postRoutes.js';
import { followRouter } from './routes/followRoute.js';
import { userRouter } from './routes/userRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { error } from './middlewares/error.js';
import { messageRoute } from './routes/messageRoute.js';
import { groupRouter } from './routes/groupRoutes.js';

app.use(cors({
    origin: `http://localhost:5173`,
    credentials: true, // if you're using cookies or HTTP authentication
  }));
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))
app.get("/",(req,res)=>{
    res.send("Hello World")
})


app.use(session({
  secret: 'Mushraf123',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  },
}));


app.use('/auth',expressRouter);
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/chat',chatRouter)
app.use(followRouter);
app.use('/message',messageRoute)
app.use('/group',groupRouter)


app.use(error)
