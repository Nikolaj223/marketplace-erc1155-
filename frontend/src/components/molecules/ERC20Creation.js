import { useForm } from 'react-hook-form';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useContractWrite } from '@wagmi/core';
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