// import { generateObject } from "ai";
// import { google } from "@ai-sdk/google";
// import { z } from "zod";

// const schema = z.object({
//   name: z.string().describe("Name of the candidate"),
//   cgpa: z.number().min(1).max(10).describe("The CGPA between 1-10"),
//   workExperience: z.string().describe("Worked in a company"),
//   projects: z.string().describe("Total projects with titles"),
// });

// export const extractDataFromResume = async (fileBuffer: Buffer) => {
//   const { object } = await generateObject({
//     model: google("gemini-1.5-flash"),
//     system: `You will receive a resume. Please extract the data from it.`,
//     schema,
//     messages: [
//       {
//         role: "system",
//         content: "You are a helpful assistant that extracts data from resumes.",
//       },
//       {
//         role: "user",
//         content: {
//           type: "file",
//           data: fileBuffer,
//           mimeType: "application/pdf",
//         },
//       },
//     ],
//   });

//   return object;
// };