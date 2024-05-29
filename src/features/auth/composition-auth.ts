import {AuthRepository} from "../../features/auth/auth-repository";
import {AuthService} from "../../features/auth/auth-service";
import {AuthController} from "../../features/auth/auth-controller";


export const authRepository = new AuthRepository()

export const authService = new AuthService(authRepository)
export const authController = new AuthController(authService)