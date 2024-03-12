import { StringExpression, Types } from "mongoose";

interface IArrayOp {
    field: string;
    key: "add" | "remove";
    value: Types.ObjectId;
}
export interface IUpdateQuery{
    $set: any
    $pull: any
    $push: any
}
export interface IUpdateData{
    array_operation?: IArrayOp
    username?: string
    email?: string
    first_name?: string
    last_name?: string
    title?: string
    description?: string
    category?: string
    content_type?: "Topic" | "Task"
    public?: boolean
    start_date?: Date
    end_date?: Date
    notify?: boolean
    finished?: boolean
    content?: string
}
type dataType = IArrayOp | string | Date | boolean
export function addUpdateQuery(updateQuery: IUpdateQuery , field: string, data: dataType): void{
    if (typeof data === 'object' && field === 'array_operation'){
        const arOp: IArrayOp = <IArrayOp>data 
        if (arOp.key === 'add'){
            updateQuery.$push[arOp.field]= String(arOp.value)
        }else{
            updateQuery.$pull[field] = String(arOp.value)
        }
    }else {
        updateQuery.$set[field] = data;
    }
}