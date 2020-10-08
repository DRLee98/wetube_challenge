import express from "express";
import routes from "../routes";
import {
  userDetail,
  editProfile,
  changePassword,
  getMe,
} from "../controllers/userController";
import { onlyPrivate } from "../middlewares";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, editProfile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), userDetail);

userRouter.get(routes.me, getMe);

export default userRouter;
