import { Button } from '@mui/material';
import { useConnect, useAccount } from 'wagmi';
import { useContext } from 'react';
import { Web3Context } from '../providers/Web3Provider';
import config from '../pages/wagmi-config';
import dynamic from 'next/dynamic';

const DynamicConnectButton = dynamic(() => Promise.resolve(ConnectButtonComponent), {
  ssr: false,
  loading: () => <Button disabled>Connecting...</Button> // Placeholder пока грузится
});

function ConnectButtonComponent() {
  const { isConnected } = useAccount();
  const { connect, isLoading } = useConnect({
    connector: config.connectors[0], // Берем коннектор MetaMask из конфига, а может быть WalletConnect
  });

  const onClick = () => {
    if (!isConnected) connect();
  };

  return (
    <Button color="inherit" onClick={onClick} disabled={isLoading}>
      {isConnected ? 'Connected' : 'Connect to MetaMask'}
    </Button>
  );
}

export default function ConnectButton() {
  return <DynamicConnectButton />;
}

// вот мой код ConnectButton.js
// import { Button } from '@mui/material';
// import { useConnect, useAccount } from 'wagmi'; // Изменяем импорт
// import { useContext } from 'react';
// import { Web3Context } from '../providers/Web3Provider';
// import config from '../pages/wagmi-config';

// export default function ConnectButton() {
//     const { isConnected } = useAccount(); // Подключение статуса
//     const { connect, isLoading } = useConnect({
//         connector: config.connectors[0], // Используем коннектор из конфигурации
//     });

//     const onClick = () => {
//         if (!isConnected) connect();
//     };

//     return (
//         <Button color="inherit" onClick={onClick} disabled={isLoading}>
//             {isConnected ? 'Connected' : 'Connect to MetaMask'}
//         </Button>
//     );
// }