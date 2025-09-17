import {proxy} from "valtio";

export interface Rule {
    type: string,
    value?: string | boolean,
    message?: string
}

export interface Variable {
    name: string,
    type: string,
    value: string
    rules: Rule[]
}

export const startNodeState = proxy({
    open: false,
    variable: {} as Variable,
})

export const openEditStartDialog = (open: boolean, variable?: Variable) => {
    startNodeState.open = open;
    startNodeState.variable = variable || {} as Variable;
}