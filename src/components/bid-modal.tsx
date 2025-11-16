'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Shield, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AuctionItem } from '@/types/auction'
import { encryptBidAmount, generateZKProof, getEncryptedBidDisplay } from '@/lib/fhe-utils'

interface BidModalProps {
  auction: AuctionItem
  isOpen: boolean
  onClose: () => void
  onSubmitBid: (auctionId: string, encryptedBid: string, proof: string) => Promise<void>
  userAddress: string
}

export function BidModal({
  auction,
  isOpen,
  onClose,
  onSubmitBid,
  userAddress,
}: BidModalProps) {
  const [bidAmount, setBidAmount] = useState<string>('')
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false)
  const [encryptedBid, setEncryptedBid] = useState<string>('')
  const [proof, setProof] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleEncrypt = async (): Promise<void> => {
    setError('')
    const amount = parseFloat(bidAmount)

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount')
      return
    }

    if (amount < auction.startingBid) {
      setError(`Bid must be at least ${auction.startingBid} ETH`)
      return
    }

    setIsEncrypting(true)
    try {
      // Simulate FHE encryption
      const encrypted = await encryptBidAmount(amount)
      const zkProof = await generateZKProof(amount, userAddress)
      
      setEncryptedBid(encrypted)
      setProof(zkProof)
    } catch (err) {
      setError('Failed to encrypt bid. Please try again.')
      console.error(err)
    } finally {
      setIsEncrypting(false)
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (!encryptedBid || !proof) {
      setError('Please encrypt your bid first')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmitBid(auction.id, encryptedBid, proof)
      handleClose()
    } catch (err) {
      setError('Failed to submit bid. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = (): void => {
    setBidAmount('')
    setEncryptedBid('')
    setProof('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-purple-900/40 rounded-2xl border border-purple-500/30 p-6 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="w-8 h-8 text-purple-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  Place Encrypted Bid
                </h2>
              </div>
              <p className="text-sm text-gray-400">{auction.title}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold mb-1">Privacy Guaranteed</p>
                    <p className="text-xs text-gray-400">
                      Your bid will be encrypted using Fully Homomorphic Encryption (FHE).
                      No one can see your bid amount until the auction ends.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bidAmount" className="text-white mb-2 flex items-center gap-2">
                  Bid Amount (ETH)
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </Label>
                <Input
                  id="bidAmount"
                  type="number"
                  step="0.01"
                  min={auction.startingBid}
                  placeholder={`Min: ${auction.startingBid} ETH`}
                  value={bidAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBidAmount(e.target.value)}
                  disabled={isEncrypting || isSubmitting || Boolean(encryptedBid)}
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Starting bid: {auction.startingBid} ETH
                </p>
              </div>

              {encryptedBid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-300 mb-1">
                        Bid Encrypted Successfully
                      </p>
                      <p className="text-xs text-gray-400 break-all font-mono">
                        {getEncryptedBidDisplay(encryptedBid)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-3">
              {!encryptedBid ? (
                <>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1 border-purple-500/30 hover:bg-purple-500/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEncrypt}
                    disabled={isEncrypting || !bidAmount}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isEncrypting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Encrypting...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Encrypt Bid
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Submit Encrypted Bid
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
