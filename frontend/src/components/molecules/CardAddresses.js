// Отображает адреса создателя, владельца и (если доступно) продавца NFT.

import CardAddress from '../atoms/CardAddress';

export default function CardAddresses({ item, type = 'nft' }) {
  // item может быть объектом NFT или ERC1155 токеном

  return (
    <>
      {/* Всегда отображаем адрес создателя, если он есть */}
      {item.creator && <CardAddress title="Creator" address={item.creator} />}

      {/* Если это NFT, отображаем владельца */}
      {type === 'nft' && <CardAddress title="Owner" address={item.owner} />}

      {/* Если это ERC1155, можно отобразить адреса нескольких владельцев или балансы */}
      {type === 'erc1155' && (
        <>
          {/* Пример: отображаем первых 3 владельцев */}
          {item.owners && item.owners.slice(0, 3).map((owner, index) => (
            <CardAddress key={index} title={`Owner ${index + 1}`} address={owner} />
          ))}
          {/* Или можно отобразить баланс для конкретного владельца */}
          {/* <CardAddress title="Balance" address={item.balance} /> */}
        </>
      )}

      {/* Отображаем адрес продавца (если он есть) */}
      {item.seller && <CardAddress title="Seller" address={item.seller} />}
    </>
  );
}