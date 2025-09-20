import { useContext } from 'react'
import LowOnBalanceTip from '../molecules/LowOnBalanceTip'
import NavBar from '../molecules/NavBar'
import TokenModal from '../organisms/TokenModal'
import TokenModalProvider from '../providers/TokenModalProvider'
import { Web3Context } from '../providers/Web3Provider'

export default function BaseLayout ({ children }) {
  const { network, balance, isReady, hasWeb3 } = useContext(Web3Context)
  const isLowOnEther = balance < 0.1
  return (
    <>
      <TokenModalProvider>
        <NavBar/>
        {hasWeb3 && isReady && network && isLowOnEther && <LowOnBalanceTip/>}
        {children}
        <TokenModal/>
      </TokenModalProvider>
    </>
  )
}