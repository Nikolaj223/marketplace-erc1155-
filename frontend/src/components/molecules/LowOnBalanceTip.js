// Предупреждает пользователя о низком балансе основной валюты сети
import { Paper, Typography } from '@mui/material';

export default function LowOnBalanceTip() {
  return (
    <Paper
      elevation={3}
      square
      sx={{
        p: '5px 15px',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Low on ETH? Use this <a href="https://sepoliafaucet.com/" target="_blank" rel="https://www.alchemy.com/faucets/ethereum-sepolia">sepolia faucet</a> to get free test tokens!
      </Typography>
    </Paper>
  );
}