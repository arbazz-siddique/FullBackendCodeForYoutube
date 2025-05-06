import express from "express"
import { login } from "../Controllers/AuthController.js"
import { updatechaneldata, getallchanels } from "../Controllers/ChannelController.js";

const routes = express.Router();

routes.post('/login', login)
routes.patch('/update/:id', updatechaneldata)
routes.get('/getallchannel', getallchanels)



export default routes