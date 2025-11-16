'use client'

import { PrivyProvider, type PrivyProviderProps } from '@privy-io/react-auth'

const PRIVY_APP_ID = "cm5yjbh8z01lv6heoze3v3ep5"
const CLIENT_ID = "client-WY5fRbUUsnYnSBnU7hp47apYGAdUgABi38uhK4PxBYLpx"

const PrivyWrapper: React.FC<PrivyProviderProps> = ({ children, ...props }) => {
  return (
    <PrivyProvider 
      appId={PRIVY_APP_ID} 
      clientId={CLIENT_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
          showWalletLoginFirst: true,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: {
          id: 8453, // Base
          name: 'Base',
          network: 'base',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: {
            default: {
              http: ['https://mainnet.base.org'],
            },
            public: {
              http: ['https://mainnet.base.org'],
            },
          },
        },
        supportedChains: [
          {
            id: 8453, // Base
            name: 'Base',
            network: 'base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://mainnet.base.org'],
              },
              public: {
                http: ['https://mainnet.base.org'],
              },
            },
          },
        ],
      }}
      {...props}
    >
      {children}
    </PrivyProvider>
  )
}

export { PrivyWrapper }
