import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
import {incrementId} from "../../helpers/functions.js"
dotenv.config();

import {userRegistrationQuery, getUserDataByUsernameQuery, userDetailQuery, updateTokenQuery, getLastEmployeeIdQuery} from "../models/userQuery.js";

export const userRegistration = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let [emp_data] = await getLastEmployeeIdQuery();
        let id = emp_data[0].emp_id
        const emp_id = await incrementId(id)

        let { username, first_name, last_name, email, password } = req.body;
        email = email.toLowerCase();
        const [existingUser] = await userDetailQuery([username, email]);
        if (existingUser.length) {
            return successResponse(res, '', 'User with this email already exists.');
        }
        const password_hash = await bcrypt.hash(password.toString(), 12);
        console.log("Password hash", password_hash);
        const [user_data] = await userRegistrationQuery([
            emp_id,
            username,
            password_hash,
            first_name,
            last_name,
            email,
            new Date(),
            new Date(),
        ]);
        return successResponse(res, user_data, 'User successfully registered');
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const { username, password } = req.body;
        const [user] = await getUserDataByUsernameQuery([username]);
        if (user.length == 0 ){
            return notFoundResponse(res, '', 'User not found');
        }else{
            let message = '';
            let token = '';
            if (username && password) {
                const isPasswordValid = await bcrypt.compare(password, user[0].password);
                if (isPasswordValid) {
                    message = 'You are successfully logged in';
                } else {
                    return unAuthorizedResponse(res, '', 'Authentication failed');
                }
            } else {
                return notFoundResponse(res, '', 'Input fields are incorrect!');
            }
            token = jwt.sign({ user_id: user[0].emp_id, name: user[0].first_name }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION_TIME,
            });
            await updateTokenQuery([ token, user[0].emp_id]);
            return successResponse(res, [{ user_id: user[0].emp_id, token: token }], message);
        }
    }
    catch(error){
        next(error);
    }
}

export const userLogout = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        console.log(user_id)
        await updateTokenQuery(["", user_id]);
        return successResponse(res, '', `You have successfully logged out!`);
    } catch (error) {
        next(error);
    }
}