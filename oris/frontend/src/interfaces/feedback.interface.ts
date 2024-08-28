
export interface Feedback{
    id: string,
    timestamp: number,
    response: Answer[];
    comments?: string;
}

export interface Answer {
    id: string,
    question: string,
    answer: string
}
