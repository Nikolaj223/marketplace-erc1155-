import { Card, CardMedia, CardContent, Typography } from '@mui/material';

function CardItem({ item, type, classes }) {
  // Используем деструктуризацию, чтобы получить данные из объекта item

  // Функция отображения контента для ERC20 токена
  const renderERC20 = () => (
    <>
      <Typography variant="h6">{item.name}</Typography>
      <Typography>Balance: {item.balance}</Typography>
      {/* Дополнительный контент для ERC20 */}
    </>
  );

  // Функция отображения контента для NFT
  const renderNFT = () => (
    <>
      {item.image && <CardMedia className={classes.media} image={item.image} title={item.name} />}
      <Typography variant="h6">{item.name}</Typography>
      <Typography>{item.description}</Typography>
      {/* Дополнительный контент для NFT */}
    </>
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        {/* Условный рендеринг в зависимости от типа */}
        {type === 'erc20' && renderERC20()}
        {type === 'nft' && renderNFT()}
        {/* Можно добавить default случай, если type не определен */}
      </CardContent>
    </Card>
  );
}

export default CardItem;