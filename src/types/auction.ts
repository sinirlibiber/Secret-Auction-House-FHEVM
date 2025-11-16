export interface AuctionItem {
  id: string
  title: string
  description: string
  imageUrl: string
  startingBid: number
  currentHighestBid: number | null
  encryptedBidsCount: number
  startTime: Date
  endTime: Date
  status: 'upcoming' | 'active' | 'ended'
  winner?: string
  category: string
}

export interface EncryptedBid {
  id: string
  auctionId: string
  bidder: string
  encryptedAmount: string
  timestamp: Date
  proofData: string
}

export interface BidHistoryItem {
  id: string
  auctionId: string
  bidder: string
  timestamp: Date
  status: 'pending' | 'confirmed' | 'revealed'
}
