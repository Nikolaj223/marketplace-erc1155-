// Задача: Модальное окно для отображения информации о конкретном токене.
// Импорты:
// useContext (react): Получение контекста.
// TokenModalContext (../providers/TokenModalProvider): Контекст с инфой о токене, который нужно показать, и состоянием модального окна.
// Fade, Modal, Backdrop (MUI): UI-компоненты для модального окна с анимацией.
// makeStyles (MUI): Устаревавший способ задания стилей, правильнее использовать styled-components или sx.
// TokenModalContent (./TokenModalContent): Компонент, отвечающий за отображение контента внутри модального окна (детали о токене).
// Логика:
// Получает информацию о токене (modalToken), и состояние модального окна (isModalOpen) из контекста TokenModalContext.
// Отображает модальное окно, если isModalOpen true.
// Внутри модального окна рендерится TokenModalContent, которому передается информация о токене.
// При закрытии модалки вызывается handleCloseModal, который обновляет состояние isModalOpen в контексте.

import { useContext } from 'react';
import { TokenModalContext } from '../providers/TokenModalProvider'; // Подменяем контекст
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import { makeStyles } from '@mui/styles';
import TokenModalContent from './TokenModalContent'; // Подменяем контент

const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function TokenModal() { // Переименовываем компонент
  const classes = useStyles();
  const { modalToken, isModalOpen, setIsModalOpen } = useContext(TokenModalContext); // Подменяем переменную

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!modalToken) { // Подменяем переменную
    return null;
  }


  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      className={classes.modal}
      aria-labelledby="token-modal-title" // Подменяем id
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isModalOpen}>
        <div className={classes.modalContent}>
          <TokenModalContent token={modalToken} onClick={handleCloseModal} /> {/* Подменяем переменную и компонент */}
        </div>
      </Fade>
    </Modal>
  );
}







// import { useContext } from 'react';
// import { NFTModalContext } from '../providers/NFTModalProvider';
// import Fade from '@mui/material/Fade';
// import Modal from '@mui/material/Modal';
// import Backdrop from '@mui/material/Backdrop';
// import { makeStyles } from '@mui/styles';
// import NFTModalContent from './TokenModalContent';

// const useStyles = makeStyles({
//   modal: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default function NFTModal() {
//   const classes = useStyles();
//   const { modalNFT, isModalOpen, setIsModalOpen } = useContext(NFTModalContext);

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   // Если modalNFT отсутствует, возвращаем null, а не пустой фрагмент
//   if (!modalNFT) {
//     return null;
//   }

//   // Проверяем, переданы ли данные для ERC1155
//   const isERC1155 = modalNFT.type === 'ERC1155' && modalNFT.balance !== undefined;

//   return (
//     <Modal
//       open={isModalOpen}
//       onClose={handleCloseModal}
//       className={classes.modal}
//       aria-labelledby="nft-modal-title"
//       closeAfterTransition
//       BackdropComponent={Backdrop}
//       BackdropProps={{
//         timeout: 500,
//       }}
//     >
//       <Fade in={isModalOpen}>
//         {/* Оборачиваем контент модалки в div с классом для стилизации */}
//         <div className={classes.modalContent}>
//           {/* Отображаем баланс, если это ERC1155 токен */}
//           {isERC1155 && (
//             <p>Баланс: {modalNFT.balance}</p>
//           )}
//           <NFTModalContent nft={modalNFT} onClick={handleCloseModal} />
//         </div>
//       </Fade>
//     </Modal>
//   );
// }