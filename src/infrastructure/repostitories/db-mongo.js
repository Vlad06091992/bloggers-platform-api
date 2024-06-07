"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const URL = process.env.MONGO_URL || "mongodb://localhost:27017";
if (!URL) {
    throw new Error("URL not found");
}
exports.client = new mongodb_1.MongoClient(URL);
// const db = client.db('base-backend');
const db = exports.client.db();
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(URL);
            console.log("Connected successfully mongoose");
            //Connect client to the server
            yield exports.client.connect();
            //Establish ane verify connection
            yield db.command({ ping: 1 });
            console.log("Connected successfully to mongo server");
        }
        catch (_a) {
            //Ensures that the client will close when your finish/error
            console.log(`can't connect to db`);
            yield exports.client.close();
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDb = runDb;
