import {z} from "zod";
export const ResumeSAnalysisSchema=z.object({
    "strengths":z.array(z.string()),
    "weaknesses":z.array(z.string()),
    "overall-score":z.number().min(0).max(10),
    "improvements":z.array(z.string()),

})