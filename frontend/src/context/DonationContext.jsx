import { createContext, useContext, useState } from 'react'

const DonationContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useDonation = () => useContext(DonationContext)

// Static dummy child data
const DUMMY_CHILD = {
  id: '1',
  name: 'Janamithra',
  age: '8 months',
  condition: 'Liver Disease (Biliary Atresia)',
  image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
  requiredAmount: 7000000,
  raisedAmount: 214385,
  story:
    'Janamithra is 8 months old and needs a liver transplant to survive. Your support can save his life.',
  verified: true,
}

export function DonationProvider({ children }) {
  const [selectedChild] = useState(DUMMY_CHILD)
  const [donationAmount, setDonationAmount] = useState(10)
  const [transactionId, setTransactionId] = useState(null)

  const confirmDonation = (amount) => {
    setDonationAmount(amount)
    const txId = 'HP' + Date.now().toString().slice(-8)
    setTransactionId(txId)
    return txId
  }

  const percentage = Math.min(
    ((selectedChild.raisedAmount / selectedChild.requiredAmount) * 100).toFixed(2),
    100
  )

  return (
    <DonationContext.Provider
      value={{
        selectedChild,
        donationAmount,
        setDonationAmount,
        transactionId,
        confirmDonation,
        percentage,
      }}
    >
      {children}
    </DonationContext.Provider>
  )
}
