'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Lock, Users, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AuctionItem } from '@/types/auction'

interface AuctionCardProps {
  auction: AuctionItem
  onBidClick: (auction: AuctionItem) => void
}

export function AuctionCard({ auction, onBidClick }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const updateTimer = (): void => {
      const now = new Date().getTime()
      const targetTime = auction.status === 'upcoming' 
        ? auction.startTime.getTime() 
        : auction.endTime.getTime()
      
      const distance = targetTime - now

      if (distance < 0) {
        setTimeLeft('Ended')
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [auction])

  const getStatusColor = (): string => {
    switch (auction.status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'ended':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-purple-500/20 bg-gradient-to-br from-gray-900/90 to-purple-900/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
        <div className="relative">
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={getStatusColor()}>
              {auction.status}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {auction.category}
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              {auction.title}
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {auction.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
              <div className="text-xs text-gray-400 mb-1">Starting Bid</div>
              <div className="text-lg font-bold text-white">
                {auction.startingBid} ETH
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Encrypted Bids
              </div>
              <div className="text-lg font-bold text-purple-400 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {auction.encryptedBidsCount}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-purple-400" />
                {auction.status === 'upcoming' ? 'Starts in' : 'Ends in'}
              </div>
              <div className="text-sm font-mono font-bold text-white">
                {timeLeft}
              </div>
            </div>
          </div>

          <Button
            onClick={() => onBidClick(auction)}
            disabled={auction.status !== 'active'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
          >
            {auction.status === 'active' ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Place Encrypted Bid
              </>
            ) : auction.status === 'upcoming' ? (
              'Coming Soon'
            ) : (
              'Auction Ended'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
