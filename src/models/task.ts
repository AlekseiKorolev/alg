export interface Task {
    title: string,
    path: string,
    task: string[],
    rules: string[],
    text: string,
    constraints: string[],
    followUp: string,
    testCases: any[],
    results: any[]
}