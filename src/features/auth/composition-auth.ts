import "reflect-metadata"
import {AuthRepository} from "../../features/auth/auth-repository";
import {AuthService} from "../../features/auth/auth-service";
import {AuthController} from "../../features/auth/auth-controller";
import {Container} from "inversify";


export const container = new Container()
container.bind(AuthController).to(AuthController)
container.bind(AuthRepository).to(AuthRepository)
container.bind(AuthService).to(AuthService)