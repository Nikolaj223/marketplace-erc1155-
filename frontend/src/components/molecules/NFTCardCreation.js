import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, CircularProgress, TextField } from '@mui/material';
import { Web3Context } from '../providers/Web3Provider';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import NFTItem from './NFTItem';

export default function NFTCardCreation({ addNFTToList }) {
    // const [file, setFile] = useState(null); // Удалено: не используется
    // const [fileUrl, setFileUrl] = useState('default_image_url'); // Удалено: не используется
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { nftContract } = useContext(Web3Context);
    // const [isLoading, setIsLoading] = useState(false); // Удалено: дублируется с isMinting

    const { config } = usePrepareContractWrite({
        address: nftContract.address,
        abi: nftContract.abi,
        functionName: 'mint',
        args: [0, 0, ""], // Заглушки для tokenId, amount, metadataUrl
    });

    const { write, data, isLoading: isMinting, isError } = useContractWrite(config);
    const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    async function onSubmit(data) {
       write?.({
            args: [data.tokenId, data.amount, data.metadataUrl],
        });
    }

    return (
        <NFTItem title="Create NFT" description="Mint your own NFT">
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField label="Token ID" {...register("tokenId", { required: true })} />
                <TextField label="Amount" type="number" {...register("amount", { required: true })} />
                <TextField label="Metadata URL" {...register("metadataUrl", { required: true })} />
                <Button type="submit" disabled={!write || isMinting}>
                    {isMinting ? <CircularProgress size={24} /> : 'Mint NFT'}
                </Button>
            </form>
        </NFTItem>
    );
}





// import { useContext, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { makeStyles } from '@mui/styles';
// import { TextField, Card, CardActions, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';
// import axios from 'axios';
// import { Web3Context } from '../providers/Web3Provider';
// import { useContractWrite } from 'wagmi';

// const useStyles = makeStyles({/*стили*/});
// const defaultFileUrl = 'https://miro.medium.com/max/250/1*DSNfSDcOe33E2Aup1Sww2w.jpeg';

// export default function NFTCardCreation({ addNFTToList }) {
//     //стейты и контексты
//     const [file, setFile] = useState(null);
//     const [fileUrl, setFileUrl] = useState(defaultFileUrl);
//     const { register, handleSubmit, reset } = useForm();
//     const { nftContract } = useContext(Web3Context); // Предполагается, что nftContract содержит ABI и адрес контракта
//     const [isLoading, setIsLoading] = useState(false);

//     const { write: mint, isLoading: isMinting } = useContractWrite({
//         address: nftContract.address,
//         abi: nftContract.abi,
//         functionName: 'mint', // Замените на название функции mint в вашем контракте ERC1155
//     });

//     async function createNft(metadataUrl) {
//         mint({ args: [metadataUrl] }); // Вызов функции mint с metadataUrl
//     }

//     function createNFTFormDataFile(name, description, file) { /*создание FormData*/ }
//     async function uploadFileToIPFS(formData) { /*загрузка в IPFS*/ }

//     async function onFileChange(event) { /*изменение файла*/ }

//     async function onSubmit({ name, description }) {
//         try {
//             if (!file || isMinting) return;
//             setIsLoading(true);
//             const formData = createNFTFormDataFile(name, description, file);
//             const metadataUrl = await uploadFileToIPFS(formData);
//             await createNft(metadataUrl);
//             setFileUrl(defaultFileUrl);
//             reset();
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     return (/*карточка создания NFT*/);
// }