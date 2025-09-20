// ERC20Card.jsx (Карточка для ERC20 токенов)
import CardItem from './CardItem';

function ERC20Card({ token, classes }) {
  return (
    <CardItem
      item={{
        name: token.name,
        description: token.symbol,
        image: token.logoURI,
        contractAddress: token.address // Предположим, что это адрес контракта ERC20
      }}
      type="erc20"
      classes={classes}
    />
  );
}

export default ERC20Card;