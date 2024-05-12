import {APICallHistoryCollection} from "../../db-mongo";
import {CallToAPI} from "./types";
import moment from "moment";

export const ApiCallHistoryRepository = {
    async recordAPICall(call:CallToAPI){
        await APICallHistoryCollection.insertOne(call)
    },

    async countRequests(IP:string,URL:string, timeIntervalSeconds:number){

        const now = moment().valueOf()

        const startTime = now - timeIntervalSeconds * 1000

        const count = await APICallHistoryCollection.countDocuments({$and:[{IP},{URL},{dateToNumber:{$gt:startTime}}]})
    return count
    }

}