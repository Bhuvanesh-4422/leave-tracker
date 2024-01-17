import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import {handler} from "./handlers/action_handler.js";
import {eventHandler} from "./handlers/eventHandler.js";
import {useridHandler} from "./handlers/usersidHandler.js";
import {deleteUserHandler} from "./handlers/delete_user.js";
import {NewUserHandler} from "./handlers/NewUser.js";
import {test} from "./handlers/test.js";
import {postEvents} from "./handlers/postEvents.js";
import {updateEvent} from "./handlers/postEvents.js";

export { handler,eventHandler,useridHandler,deleteUserHandler,NewUserHandler,test,postEvents,updateEvent};