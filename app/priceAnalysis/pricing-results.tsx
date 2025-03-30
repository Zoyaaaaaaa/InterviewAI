// import { motion } from "framer-motion"
// import { DollarSign, Calendar, Shield, AlertTriangle, Check } from "lucide-react"

// interface PricingResultsProps {
//   results: {
//     status: string
//     pricing?: {
//       baseRent?: number
//       utilities?: Array<{ name: string; amount: number }>
//       fees?: Array<{ name: string; amount: number; description?: string }>
//       total?: number
//       leaseTerms?: {
//         startDate?: string
//         endDate?: string
//         minimumTerm?: string
//       }
//       deposit?: number
//       includes?: string[]
//       warnings?: string[]
//       summary?: string
//     }
//     response: string
//   }
// }

// export function PricingResults({ results }: PricingResultsProps) {
//   const { status, pricing, response } = results

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//     },
//   }

//   return (
//     <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8 space-y-6">
//       <motion.h2 variants={itemVariants} className="text-2xl font-bold text-green-800">
//         Transparent Pricing Breakdown
//       </motion.h2>

//       {status === "success" && pricing ? (
//         <>
//           <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
//               <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
//                 <DollarSign className="mr-2" /> Cost Breakdown
//               </h3>
//               <div className="space-y-2">
//                 <p>
//                   <strong>Base Rent:</strong> ${pricing.baseRent?.toFixed(2)}
//                 </p>
//                 {pricing.utilities && pricing.utilities.length > 0 && (
//                   <div>
//                     <strong>Utilities:</strong>
//                     <ul className="ml-4">
//                       {pricing.utilities.map((utility, index) => (
//                         <li key={index} className="flex justify-between">
//                           <span>{utility.name}:</span>
//                           <span>${utility.amount.toFixed(2)}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//                 {pricing.fees && pricing.fees.length > 0 && (
//                   <div>
//                     <strong>Additional Fees:</strong>
//                     <ul className="ml-4">
//                       {pricing.fees.map((fee, index) => (
//                         <li key={index} className="flex justify-between">
//                           <span>{fee.name}:</span>
//                           <span>${fee.amount.toFixed(2)}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//                 <p className="mt-4 text-lg font-semibold text-green-600">
//                   <strong>Total Monthly Cost:</strong> ${pricing.total?.toFixed(2)}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
//               <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
//                 <Calendar className="mr-2" /> Lease Terms
//               </h3>
//               {pricing.leaseTerms && (
//                 <div className="space-y-2">
//                   <p>
//                     <strong>Start Date:</strong> {pricing.leaseTerms.startDate}
//                   </p>
//                   <p>
//                     <strong>End Date:</strong> {pricing.leaseTerms.endDate}
//                   </p>
//                   <p>
//                     <strong>Minimum Term:</strong> {pricing.leaseTerms.minimumTerm}
//                   </p>
//                 </div>
//               )}
//               <p className="mt-4">
//                 <strong>Security Deposit:</strong> ${pricing.deposit?.toFixed(2)}
//               </p>
//             </div>
//           </motion.div>

//           <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md border border-green-200">
//             <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
//               <Shield className="mr-2" /> What's Included
//             </h3>
//             {pricing.includes && pricing.includes.length > 0 ? (
//               <ul className="grid grid-cols-2 gap-2">
//                 {pricing.includes.map((item, index) => (
//                   <li key={index} className="flex items-center">
//                     <Check className="mr-2 text-green-500" />
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No inclusions specified.</p>
//             )}
//           </motion.div>

//           {pricing.warnings && pricing.warnings.length > 0 && (
//             <motion.div
//               variants={itemVariants}
//               className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200"
//             >
//               <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center">
//                 <AlertTriangle className="mr-2" /> Important Considerations
//               </h3>
//               <ul className="space-y-2">
//                 {pricing.warnings.map((warning, index) => (
//                   <li key={index} className="flex items-start">
//                     <AlertTriangle className="mr-2 text-yellow-500 mt-1 flex-shrink-0" />
//                     <span>{warning}</span>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}

//           {pricing.summary && (
//             <motion.div
//               variants={itemVariants}
//               className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200"
//             >
//               <h3 className="text-lg font-semibold text-green-700 mb-4">Summary</h3>
//               <p className="text-green-800">{pricing.summary}</p>
//             </motion.div>
//           )}
//         </>
//       ) : (
//         <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md border border-green-200">
//           <h3 className="text-lg font-semibold text-green-700 mb-4">Analysis</h3>
//           <p className="text-green-800">{response}</p>
//         </motion.div>
//       )}
//     </motion.div>
//   )
// }

