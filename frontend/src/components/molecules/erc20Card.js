// ERC20Card.jsx (Карточка для ERC20 токенов)
import CardItem from './CardItem';

function ERC20Card({ token, classes }) { // token - объект с данными ERC20 токена
  return (
    <CardItem
      title={token.name}
      description={token.symbol} // В качестве описания выводим символ токена
      image={token.logoURI} // URI логотипа
      classes={classes}
    >
      <p>Total Supply: {token.totalSupply}</p> {/* Вывод общего предложения токенов */}
    </CardItem>
  );
}

export default ERC20Card;