'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import { Lock, Sparkles, Shield, Wallet, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AuctionCard } from '@/components/auction-card'
import { BidModal } from '@/components/bid-modal'
import { mockAuctions } from '@/lib/mock-data'
import type { AuctionItem } from '@/types/auction'
import { toast } from 'sonner'
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function HomePage() {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const { ready, authenticated, login, user } = usePrivy()
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null)
  const [auctions, setAuctions] = useState<AuctionItem[]>(mockAuctions)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming'>('all')

  const userAddress = user?.wallet?.address || ''

  useEffect(() => {
    let filtered = mockAuctions

    if (searchQuery) {
      filtered = filtered.filter((auction: AuctionItem) =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((auction: AuctionItem) => auction.status === filterStatus)
    }

    setAuctions(filtered)
  }, [searchQuery, filterStatus])

  const handleBidClick = (auction: AuctionItem): void => {
    if (!authenticated) {
      login()
      return
    }
    setSelectedAuction(auction)
  }

  const handleSubmitBid = async (
    auctionId: string,
    encryptedBid: string,
    proof: string
  ): Promise<void> => {
    // Simulate bid submission to blockchain
    await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 2000))
    
    // Update auction bid count
    setAuctions((prev: AuctionItem[]) =>
      prev.map((auction: AuctionItem) =>
        auction.id === auctionId
          ? { ...auction, encryptedBidsCount: auction.encryptedBidsCount + 1 }
          : auction
      )
    )

    toast.success('Encrypted bid submitted successfully!', {
      description: 'Your bid is now securely recorded on-chain.',
    })
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSw5MiwyNDYsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        <div className="container mx-auto px-4 py-12 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="w-10 h-10 text-purple-400" />
                </motion.div>
                <Sparkles className="w-5 h-5 text-pink-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Secret Auction House
                </h1>
                <p className="text-sm text-gray-400">Powered by Zama FHEVM</p>
              </div>
            </motion.div>

            {!authenticated ? (
              <Button
                onClick={login}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  Connected
                </Badge>
                <div className="text-sm text-gray-400 font-mono">
                  {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                </div>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mb-12"
          >
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold mb-2">Complete Privacy Guaranteed</h2>
                <p className="text-gray-300 mb-4">
                  All bids are encrypted using Fully Homomorphic Encryption (FHE) powered by Zama FHEVM.
                  Your bid amount remains completely confidential until the auction ends. No one, not even
                  the smart contract operator, can see your bid!
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    🔒 FHE Encrypted
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    ⛓️ On-Chain
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    🛡️ Zero-Knowledge Proofs
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    🚀 Base Network
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilterStatus('all')}
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                className={filterStatus === 'all' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-purple-500/30 hover:bg-purple-500/10'
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                onClick={() => setFilterStatus('active')}
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                className={filterStatus === 'active' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-purple-500/30 hover:bg-purple-500/10'
                }
              >
                Active
              </Button>
              <Button
                onClick={() => setFilterStatus('upcoming')}
                variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                className={filterStatus === 'upcoming' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-purple-500/30 hover:bg-purple-500/10'
                }
              >
                Upcoming
              </Button>
            </div>
          </div>

          {/* Auctions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {auctions.map((auction: AuctionItem) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onBidClick={handleBidClick}
              />
            ))}
          </div>

          {auctions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No auctions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bid Modal */}
      {selectedAuction && (
        <BidModal
          auction={selectedAuction}
          isOpen={Boolean(selectedAuction)}
          onClose={() => setSelectedAuction(null)}
          onSubmitBid={handleSubmitBid}
          userAddress={userAddress}
        />
      )}
    </div>
  )
}
