import {APICallHistoryModelClass} from "../../mongoose/models";
import {CallToAPIType} from "./types";
import moment from "moment";

export class ApiCallHistoryRepository {
    async recordAPICall(call: CallToAPIType) {
        await APICallHistoryModelClass.create(call)
    }
    async countRequests(IP: string, URL: string, timeIntervalSeconds: number) {
        const now = moment().valueOf()
        const startTime = now - timeIntervalSeconds * 1000
        const count = await APICallHistoryModelClass.countDocuments({$and: [{IP}, {URL}, {dateToNumber: {$gt: startTime}}]})
        return count
    }
    async deleteAllRecords(){
        await APICallHistoryModelClass.deleteMany({})
        return true
    }
}

export const apiCallHistoryRepository = new ApiCallHistoryRepository()