
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