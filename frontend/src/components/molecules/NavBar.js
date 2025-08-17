//  выполняет функции навигации и отображает статус подключения Web3-кошелька пользователя. 
// Компонент навигации, отображает ссылки и статус подключения кошелька.

import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Web3Context } from '../providers/Web3Provider';
import NavItem from '../atoms/NavItem';
import ConnectedAccountAddress from '../atoms/ConnectedAccountAddress';
import ConnectButton from '../atoms/ConnectButton';

const pages = [
  { title: 'Market', href: '/' },
  { title: 'MY NFTs', href: '/my-nfts' },
];

const NavBar = () => {
  // Получаем состояние аккаунта из Web3Context.
  const { account } = useContext(Web3Context);
  const logo = '🖼️';

  return (
    <AppBar position="static">
      <Container maxWidth="100%">
        <Toolbar disableGutters>
          <Typography variant="h3" noWrap component="div" sx={{ p: '10px', flexGrow: { xs: 1, md: 0 }, display: 'flex' }}>
            {logo}
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map(({ title, href }) => (
              <NavItem title={title} href={href} key={title} />
            ))}
          </Box>
          {/* Отображаем адрес подключенного аккаунта или кнопку подключения. */}
          {account ? <ConnectedAccountAddress account={account} /> : <ConnectButton />}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;