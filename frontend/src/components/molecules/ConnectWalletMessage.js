//  Отображает сообщение, если кошелек пользователя не подключен.
import PageMessageBox from './PageMessageBox'

export default function ConnectWalletMessage () {
  return (
    <PageMessageBox
      text="Please connect your wallet to view this page"
    />
  )
}