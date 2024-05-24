import {APICallHistoryModelClass} from "../../mongoose/models";
import {CallToAPI} from "./types";
import moment from "moment";

export const ApiCallHistoryRepository = {
    async recordAPICall(call: CallToAPI) {
        await APICallHistoryModelClass.create(call)
    },

    async countRequests(IP: string, URL: string, timeIntervalSeconds: number) {

        const now = moment().valueOf()

        const startTime = now - timeIntervalSeconds * 1000

        const count = await APICallHistoryModelClass.countDocuments({$and: [{IP}, {URL}, {dateToNumber: {$gt: startTime}}]})
        return count
    },
    async deleteAllRecords(){
        await APICallHistoryModelClass.deleteMany({})
        return true
    },

}