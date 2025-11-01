// предоставить механизм для хранения и обновления *объекта* и *флага* открытия
// Компонент-провайдер для управления состоянием модального окна NFT.
import { createContext, useState } from 'react';

// Начальные значения контекста.
const contextDefaultValues = {
  modalNFT: undefined, // NFT, который нужно отобразить в модальном окне.
  isModalOpen: false,  // Флаг, показывающий, открыто ли модальное окно.
  setModalNFT: () => {}, // Функция для установки modalNFT.
  setIsModalOpen: () => {} // Функция для установки isModalOpen.
};

// Создаем контекст для NFT модального окна.
export const NFTModalContext = createContext(contextDefaultValues);

// Функция-компонент, предоставляющая контекст для дочерних компонентов.
export default function NFTModalProvider({ children }) {
  // Состояние для NFT и флага открытия модального окна.
  const [modalNFT, setModalNFT] = useState(contextDefaultValues.modalNFT);
  const [isModalOpen, setIsModalOpen] = useState(contextDefaultValues.isModalOpen);

  return (
    // Предоставляем контекст с состоянием и функциями обновления.
    <NFTModalContext.Provider
      value={{
        modalNFT,
        isModalOpen,
        setModalNFT,
        setIsModalOpen
      }}
    >
      {children}
    </NFTModalContext.Provider>
  );
}