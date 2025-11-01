// Задача: Компонент для создания новых ERC20 токенов. Позволяет пользователю задать имя, символ, количество знаков после запятой
//  (decimals) и начальную эмиссию токена.
// Импорты:
// useForm (react-hook-form): Для управления формой и валидацией данных.
// Button, CircularProgress, TextField (MUI): UI-компоненты.
// useContractWrite (wagmi): Хук для вызова функций смарт-контракта на запись.
// Web3Context (../providers/Web3Provider): Контекст с информацией о web3 (провайдер, кошелек, фабрика контрактов ERC20)
// useContext (react): Хук для доступа к контексту.
// Логика:
// Собирает данные из формы.
// Использует useContractWrite для вызова функции createToken фабрики контрактов ERC20.
// Передает данные из формы в качестве аргументов для функции контракта.

import { useForm } from 'react-hook-form';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useContractWrite } from 'wagmi';
import { Web3Context } from '../providers/Web3Provider';
import { useContext } from 'react';

export default function ERC20Creation({ addERC20ToList }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { erc20FactoryContract } = useContext(Web3Context); // Замени на контракт фабрики ERC20

    const { data, isLoading: isCreating, isError, write } = useContractWrite({
        address: erc20FactoryContract.address,
        abi: erc20FactoryContract.abi, // Замени на ABI фабрики ERC20
        functionName: 'createToken', // Замени на функцию создания токена
        onSuccess: (data) => {
            // Вызываем addERC20ToList с данными нового токена
            console.log("Transaction hash:", data.hash);
        },
    });

    async function onSubmit(data) {
        write?.({
            args: [data.name, data.symbol, data.decimals, data.initialSupply],
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Token Name" {...register("name", { required: "Name is required" })} error={!!errors.name} helperText={errors.name?.message} />
            <TextField label="Token Symbol" {...register("symbol", { required: "Symbol is required" })} error={!!errors.symbol} helperText={errors.symbol?.message} />
            <TextField label="Decimals" type="number" {...register("decimals", { required: "Decimals is required" })} error={!!errors.decimals} helperText={errors.decimals?.message} />
            <TextField label="Initial Supply" type="number" {...register("initialSupply", { required: "Initial Supply is required" })} error={!!errors.initialSupply} helperText={errors.initialSupply?.message} />
            <Button type="submit" disabled={!write || isCreating}>
                {isCreating ? <CircularProgress size={24} /> : 'Create ERC20'}
            </Button>
        </form>
    );
}