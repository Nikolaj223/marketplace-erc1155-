// предоставить механизм для хранения и обновления *объекта* и *флага* открытия
import { createContext, useState } from 'react'

const contextDefaultValues = {
    // обратить внимание 
  modalNFT: undefined,
  isModalOpen: false,
  setModalNFT: () => {},
  setIsModalOpen: () => {}
}

export const NFTModalContext = createContext(
  contextDefaultValues
)

export default function NFTModalProvider ({ children }) {
  const [modalNFT, setModalNFT] = useState(contextDefaultValues.modalNFT)
  const [isModalOpen, setIsModalOpen] = useState(contextDefaultValues.isModalOpen)

  return (
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
  )
};