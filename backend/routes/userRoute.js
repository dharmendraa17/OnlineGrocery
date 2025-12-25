import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import { upload } from '../configs/multer.js'; //
const userRouter =express.Router();

userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.get('/is-auth' ,authUser,isAuth)
userRouter.get("/logout",authUser,logout)
 // Add this line
userRouter.post('/update-image', authUser, upload.single('image'), updateImage); //

export default userRouter;