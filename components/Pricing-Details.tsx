import type React from "react"
import { motion } from "framer-motion"
import { DollarSign, Calendar, Shield, AlertTriangle, Check } from "lucide-react"

interface Fee {
  name: string
  amount: number | null
  description?: string
}

interface LeaseTerms {
  startDate?: string
  endDate?: string
  minimumTerm?: string
}

interface PricingInfo {
  baseRent?: number
  utilities?: Array<{ name: string; amount: number }>
  fees?: Fee[]
  total?: number | null
  leaseTerms?: LeaseTerms
  deposit?: number | null
  includes?: string[]
  warnings?: string[]
  summary?: string
}

interface PricingDisplayProps {
  pricingInfo: PricingInfo
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({ pricingInfo }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A"
    return `$${amount.toFixed(2)}`
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8 space-y-6">
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-green-800">
        Transparent Pricing Breakdown
      </motion.h2>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <DollarSign className="mr-2" /> Cost Breakdown
          </h3>
          <div className="space-y-2">
            {pricingInfo.baseRent !== undefined && (
              <p>
                <strong>Base Amount:</strong> {formatCurrency(pricingInfo.baseRent)}
              </p>
            )}
            {pricingInfo.utilities && pricingInfo.utilities.length > 0 && (
              <div>
                <strong>Utilities:</strong>
                <ul className="ml-4">
                  {pricingInfo.utilities.map((utility, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{utility.name}:</span>
                      <span>{formatCurrency(utility.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pricingInfo.fees && pricingInfo.fees.length > 0 && (
              <div>
                <strong>Additional Fees:</strong>
                <ul className="ml-4">
                  {pricingInfo.fees.map((fee, index) => (
                    <li key={index} className="flex flex-col">
                      <div className="flex justify-between">
                        <span>{fee.name}:</span>
                        <span>{formatCurrency(fee.amount)}</span>
                      </div>
                      {fee.description && <span className="text-sm text-gray-600">{fee.description}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pricingInfo.total !== undefined && pricingInfo.total !== null && (
              <p className="mt-4 text-lg font-semibold text-green-600">
                <strong>Total Cost:</strong> {formatCurrency(pricingInfo.total)}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <Calendar className="mr-2" /> Agreement Terms
          </h3>
          {pricingInfo.leaseTerms && (
            <div className="space-y-2">
              {pricingInfo.leaseTerms.startDate && (
                <p>
                  <strong>Start Date:</strong> {pricingInfo.leaseTerms.startDate}
                </p>
              )}
              {pricingInfo.leaseTerms.endDate && (
                <p>
                  <strong>End Date:</strong> {pricingInfo.leaseTerms.endDate}
                </p>
              )}
              {pricingInfo.leaseTerms.minimumTerm && (
                <p>
                  <strong>Minimum Term:</strong> {pricingInfo.leaseTerms.minimumTerm}
                </p>
              )}
            </div>
          )}
          {pricingInfo.deposit !== undefined && pricingInfo.deposit !== null && (
            <p className="mt-4">
              <strong>Security Deposit:</strong> {formatCurrency(pricingInfo.deposit)}
            </p>
          )}
        </div>
      </motion.div>

      {pricingInfo.includes && pricingInfo.includes.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <Shield className="mr-2" /> What's Included
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pricingInfo.includes.map((item, index) => (
              <li key={index} className="flex items-center">
                <Check className="mr-2 text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {pricingInfo.warnings && pricingInfo.warnings.length > 0 && (
        <motion.div variants={itemVariants} className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center">
            <AlertTriangle className="mr-2" /> Important Considerations
          </h3>
          <ul className="space-y-2">
            {pricingInfo.warnings.map((warning, index) => (
              <li key={index} className="flex items-start">
                <AlertTriangle className="mr-2 text-yellow-500 mt-1 flex-shrink-0" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {pricingInfo.summary && (
        <motion.div variants={itemVariants} className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Summary</h3>
          <p className="text-green-800">{pricingInfo.summary}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PricingDisplay

