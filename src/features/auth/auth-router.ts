import express from "express";
import {validateAuthUserData} from "./validators/validateUserCredentials";
import {validateErrors} from "../../middlewares/validateErrors";
import {authBearerMiddleware} from "../../middlewares/bearerAuthMiddleware";
import {validateCreateUserData} from "./validators/validateCreateUserData";
import {check} from "express-validator";
import {attemptsMiddleware} from "../../middlewares/attemptsMiddleware";
import {validatePasswordRecoverySchema} from "./validators/validatePasswordRecoverySchema";
import {validateNewPasswordSchema} from "./validators/validateNewPasswordSchema";
import {container} from "../auth/composition-auth";
import {AuthController} from "../../features/auth/auth-controller";

const authController = container.resolve(AuthController)

export const getAuthRouter = () => {
    const router = express.Router();
    router.post(
        "/login",
        attemptsMiddleware,
        validateAuthUserData,
        validateErrors,
        authController.login.bind(authController)
    );

    router.post(
        "/registration",
        attemptsMiddleware,
        validateCreateUserData,
        validateErrors,
        authController.registration.bind(authController)
    );

    router.post(
        "/password-recovery",
        attemptsMiddleware,
        validatePasswordRecoverySchema,
        validateErrors,
        authController.passwordRecovery.bind(authController)
    );


    router.post(
        "/new-password",
        attemptsMiddleware,
        validateNewPasswordSchema,
        validateErrors,
        authController.newPassword.bind(authController)
    );


    router.post(
        "/refresh-token",
        authController.refreshToken.bind(authController)
    );


    router.post(
        "/logout",
        authController.logout.bind(authController)
    );


    router.post(
        "/registration-confirmation",
        attemptsMiddleware,
        check('code').isString(),
        validateErrors,
        authController.registrationConfirmation.bind(authController)
    );

    router.post(
        "/registration-email-resending",
        attemptsMiddleware,
        check('email').isEmail(),
        validateErrors,
        authController.registrationEmailResending.bind(authController)
    );

    router.get(
        "/me",
        authBearerMiddleware,
        authController.me.bind(authController)
    );

    return router
}