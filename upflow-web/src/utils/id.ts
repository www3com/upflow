import {nanoid} from "nanoid";

export function newId() {
    return nanoid(8)
}