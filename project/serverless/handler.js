import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import {handler} from "./actions/actionHandler.js";
import {eventHandler} from "./actions/eventHandler.js";
import {useridHandler} from "./actions/usersidHandler.js";
import {deleteUserHandler} from "./actions/deleteUser.js";
import {NewUserHandler} from "./actions/NewUser.js";
import {test} from "./actions/test.js";
import {postEvents} from "./actions/postEvents.js";
import {updateEvent} from "./actions/postEvents.js";

export { handler,eventHandler,useridHandler,deleteUserHandler,NewUserHandler,test,postEvents,updateEvent};