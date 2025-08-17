// NFTPrice.js
import { Popover, Typography } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'

// Функция для получения метки цены (более универсальная)
function getPriceLabel (priceType) { // Теперь принимает тип цены, а не весь NFT
  switch (priceType) {
    case 'sold': return 'Продано за';
    case 'offered': return 'Предлагалось за';
    case 'unitPrice': return 'Цена за шт.'; // Новое для ERC-1155
    case 'totalPrice': return 'Общая цена';
    case 'lowestPrice': return 'Мин. цена'; // Для общего отображения токена
    default: return 'Цена';
  }
}

export default function NFTPrice ({ price, priceType = 'price', currencyIcon = '/matic.png', currencySymbol = 'ETH' }) {
  // price: само числовое значение
  // priceType: строка, определяющая контекст цены ('sold', 'offered', 'unitPrice', 'totalPrice', 'lowestPrice')
  // currencyIcon: путь к иконке валюты
  // currencySymbol: символ валюты (например, 'ETH', 'USDC')

  const priceLabel = getPriceLabel(priceType);
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  return (
    <div style={{ textAlign: 'center' }}>

      <Typography
      variant="h6"
      color="text.secondary"
      >
        {priceLabel}
      </Typography>
      <Typography
      gutterBottom
      variant="h6"
      color="text.secondary"
      >
        <span style={{ display: 'inline-block', transform: 'translateY(3px)' }}>
          <Image
            alt={currencySymbol}
            src={currencyIcon}
            width="20px"
            height="20px"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        </span>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none'
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>{currencySymbol}</Typography>
        </Popover>
        {' '}{price}
      </Typography>
    </div>
  )
}




















// import { Popover, Typography } from '@mui/material'
// import Image from 'next/image'
// import { useState } from 'react'

// // Функция для получения метки цены (более универсальная)
// function getPriceLabel (priceType) { // Теперь принимает тип цены, а не весь NFT
//   switch (priceType) {
//     case 'sold': return 'Продано за';
//     case 'offered': return 'Предлагалось за';
//     case 'unitPrice': return 'Цена за шт.'; // Новое для ERC-1155
//     case 'totalPrice': return 'Общая цена';
//     case 'lowestPrice': return 'Мин. цена'; // Для общего отображения токена
//     default: return 'Цена';
//   }
// }

// export default function NFTPrice ({ price, priceType = 'price', currencyIcon = '/matic.png', currencySymbol = 'ETH' }) {
//   // price: само числовое значение
//   // priceType: строка, определяющая контекст цены ('sold', 'offered', 'unitPrice', 'totalPrice', 'lowestPrice')
//   // currencyIcon: путь к иконке валюты
//   // currencySymbol: символ валюты (например, 'ETH', 'USDC')

//   const priceLabel = getPriceLabel(priceType);
//   const [anchorEl, setAnchorEl] = useState(null)

//   const handlePopoverOpen = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handlePopoverClose = () => {
//     setAnchorEl(null)
//   }

//   const open = Boolean(anchorEl)
//   return (
//     <div style={{ textAlign: 'center' }}>

//       <Typography
//       variant="h6"
//       color="text.secondary"
//       >
//         {priceLabel}
//       </Typography>
//       <Typography
//       gutterBottom
//       variant="h6"
//       color="text.secondary"
//       >
//         <span style={{ display: 'inline-block', transform: 'translateY(3px)' }}>
//           <Image
//             alt={currencySymbol}
//             src={currencyIcon}
//             width="20px"
//             height="20px"
//             onMouseEnter={handlePopoverOpen}
//             onMouseLeave={handlePopoverClose}
//           />
//         </span>
//         <Popover
//           id="mouse-over-popover"
//           sx={{
//             pointerEvents: 'none'
//           }}
//           open={open}
//           anchorEl={anchorEl}
//           anchorOrigin={{
//             vertical: 'bottom',
//             horizontal: 'left'
//           }}
//           transformOrigin={{
//             vertical: 'top',
//             horizontal: 'left'
//           }}
//           onClose={handlePopoverClose}
//           disableRestoreFocus
//         >
//           <Typography sx={{ p: 1 }}>{currencySymbol}</Typography>
//         </Popover>
//         {' '}{price}
//       </Typography>
//     </div>
//   )
// }