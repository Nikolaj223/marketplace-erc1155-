import { Grid, Paper, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Image from 'next/image';

const useStyles = makeStyles(theme => ({
  root: {
    // Этот компонент Paper является основой вашего содержимого модального окна.
    // Он будет автоматически центрироваться компонентом Material-UI Modal.
    backgroundColor: theme.palette.background.paper, // Используем фоновый цвет темы
    boxShadow: theme.shadows[5], // Добавляем тень для визуальной глубины
    padding: theme.spacing(2, 4, 3), // Добавляем внутренние отступы
    outline: 'none', // Убираем рамку фокуса, которая появляется на содержимом модального окна
    borderRadius: theme.shape.borderRadius, // Используем радиус скругления темы
    
    // Максимальные размеры для содержимого модального окна
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto', // Разрешаем прокрутку самому Paper, если контент превышает maxHeight

    // Адаптивные настройки ширины
    [theme.breakpoints.down('sm')]: {
      width: '95vw', // Занимает больше ширины на маленьких экранах
      margin: theme.spacing(1), // Небольшие отступы от краев
    },
    [theme.breakpoints.up('sm')]: {
      width: '80%', // Занимает 80% ширины контейнера модального окна
      maxWidth: 900, // Или фиксированная максимальная ширина для очень больших экранов
    }
  },
  mainContainer: {
    display: 'flex', // Убедитесь, что flexbox активен
    // height: '100%', // Занимает всю высоту Paper (которая имеет определенный maxHeight)
    // Если вам нужна фиксированная высота, убедитесь, что ⓃrootⓃ также имеет фиксированную высоту или max-height
    
    // Для мобильных: изображение сверху, контент снизу (столбцовый макет)
    flexDirection: 'column',
    overflowY: 'auto', // Разрешаем прокрутку, если контент переполняется на мобильных
    flexGrow: 1, // Разрешаем основному контейнеру расти внутри Paper
    
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row', // На десктопах: изображение и контент рядом
      flexWrap: 'nowrap', // Предотвращаем перенос
      overflowY: 'hidden', // Отключаем прокрутку на самом основном контейнере, если контент помещается
      height: 'auto', // Регулируем высоту в зависимости от контента
    }
  },
  imageContainer: {
    // Критично для next/image layout='fill'
    position: 'relative', 
    flex: '1 1 50%', // На десктопе занимает 50% ширины
    minHeight: 250, // Минимальная высота для контейнера изображения, особенно на мобильных
    maxHeight: '60vh', // Максимальная высота для области изображения

    [theme.breakpoints.down('sm')]: {
      width: '100%', // Полная ширина на мобильных
      height: 'auto', // Разрешаем изображению определять высоту (с minHeight)
      paddingBottom: '75%', // Пример: обеспечиваем соотношение сторон 4:3 на мобильных
                            // Для ⓃobjectFit='contain'Ⓝ, это дает Image пространство
      minHeight: 200, // Обеспечиваем минимальную высоту на мобильных
      maxHeight: 'unset', // Убираем конкретную максимальную высоту на мобильных, если используется соотношение сторон
    },
    [theme.breakpoints.up('sm')]: {
      height: '100%', // Занимает всю высоту mainContainer на десктопе
      // Если контент имеет переменную высоту, скорректируйте это или используйте flex-grow
      // Убедитесь, что изображение содержится в этой высоте
    }
  },
  contentContainer: {
    flex: '1 1 50%', // На десктопе занимает 50% ширины
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Сдвинуть кнопку вниз, если контент короткий
    overflowY: 'auto', // Разрешить прокрутку описания/других деталей независимо
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      paddingTop: theme.spacing(1),
    }
  },
  title: {
    marginBottom: theme.spacing(1)
  },
  description: {
    flexGrow: 1, // Разрешить описанию занимать доступное вертикальное пространство
    marginBottom: theme.spacing(2)
  }
}));

export default function TokenModalContent({ token, onClick }) { // Переименовываем пропс
  const classes = useStyles();

  if (!token) { // Переименовываем пропс
    return null;
  }

  // Определяем, является ли токен ERC20
  const isERC20 = token.type === 'ERC20';

  return (
    <Paper className={classes.root}>
      <Grid container className={classes.mainContainer}>
        <Grid item className={classes.imageContainer}>
          {token.image && ( // Переименовываем пропс
            <Image
              src={token.image} // Переименовываем пропс
              alt={token.title || 'Token Image'} // Переименовываем пропс
              layout='fill'
              objectFit='contain'
            />
          )}
        </Grid>

        <Grid item className={classes.contentContainer}>
          <Typography variant="h5" component="h2" id="token-modal-title" className={classes.title}> {/* Переименовываем id */}
            {token.title} {/* Переименовываем пропс */}
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {token.description || 'No description available for this token.'} {/* Переименовываем пропс */}
          </Typography>

          {/* Добавляем отображение decimals для ERC20 токенов */}
          {isERC20 && (
            <Typography variant="subtitle1">
              Decimals: {token.decimals} {/* Переименовываем пропс */}
            </Typography>
          )}

          <Button variant="contained" color="primary" onClick={onClick} fullWidth>
            Закрыть
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}











// import { Grid, Paper, Typography, Button } from '@mui/material'; // Добавлены Typography, Button
// import { makeStyles } from '@mui/styles'; // Или '@mui/material/styles' для совместимости с v5, или используйте свойство ⓃsxⓃ
// import Image from 'next/image';

// const useStyles = makeStyles(theme => ({
//   root: {
//     // Этот компонент Paper является основой вашего содержимого модального окна.
//     // Он будет автоматически центрироваться компонентом Material-UI Modal.
//     backgroundColor: theme.palette.background.paper, // Используем фоновый цвет темы
//     boxShadow: theme.shadows[5], // Добавляем тень для визуальной глубины
//     padding: theme.spacing(2, 4, 3), // Добавляем внутренние отступы
//     outline: 'none', // Убираем рамку фокуса, которая появляется на содержимом модального окна
//     borderRadius: theme.shape.borderRadius, // Используем радиус скругления темы
    
//     // Максимальные размеры для содержимого модального окна
//     maxWidth: '90vw',
//     maxHeight: '90vh',
//     overflowY: 'auto', // Разрешаем прокрутку самому Paper, если контент превышает maxHeight

//     // Адаптивные настройки ширины
//     [theme.breakpoints.down('sm')]: {
//       width: '95vw', // Занимает больше ширины на маленьких экранах
//       margin: theme.spacing(1), // Небольшие отступы от краев
//     },
//     [theme.breakpoints.up('sm')]: {
//       width: '80%', // Занимает 80% ширины контейнера модального окна
//       maxWidth: 900, // Или фиксированная максимальная ширина для очень больших экранов
//     }
//   },
//   mainContainer: {
//     display: 'flex', // Убедитесь, что flexbox активен
//     // height: '100%', // Занимает всю высоту Paper (которая имеет определенный maxHeight)
//     // Если вам нужна фиксированная высота, убедитесь, что ⓃrootⓃ также имеет фиксированную высоту или max-height
    
//     // Для мобильных: изображение сверху, контент снизу (столбцовый макет)
//     flexDirection: 'column',
//     overflowY: 'auto', // Разрешаем прокрутку, если контент переполняется на мобильных
//     flexGrow: 1, // Разрешаем основному контейнеру расти внутри Paper
    
//     [theme.breakpoints.up('sm')]: {
//       flexDirection: 'row', // На десктопах: изображение и контент рядом
//       flexWrap: 'nowrap', // Предотвращаем перенос
//       overflowY: 'hidden', // Отключаем прокрутку на самом основном контейнере, если контент помещается
//       height: 'auto', // Регулируем высоту в зависимости от контента
//     }
//   },
//   imageContainer: {
//     // Критично для next/image layout='fill'
//     position: 'relative', 
//     flex: '1 1 50%', // На десктопе занимает 50% ширины
//     minHeight: 250, // Минимальная высота для контейнера изображения, особенно на мобильных
//     maxHeight: '60vh', // Максимальная высота для области изображения

//     [theme.breakpoints.down('sm')]: {
//       width: '100%', // Полная ширина на мобильных
//       height: 'auto', // Разрешаем изображению определять высоту (с minHeight)
//       paddingBottom: '75%', // Пример: обеспечиваем соотношение сторон 4:3 на мобильных
//                             // Для ⓃobjectFit='contain'Ⓝ, это дает Image пространство
//       minHeight: 200, // Обеспечиваем минимальную высоту на мобильных
//       maxHeight: 'unset', // Убираем конкретную максимальную высоту на мобильных, если используется соотношение сторон
//     },
//     [theme.breakpoints.up('sm')]: {
//       height: '100%', // Занимает всю высоту mainContainer на десктопе
//       // Если контент имеет переменную высоту, скорректируйте это или используйте flex-grow
//       // Убедитесь, что изображение содержится в этой высоте
//     }
//   },
//   contentContainer: {
//     flex: '1 1 50%', // На десктопе занимает 50% ширины
//     padding: theme.spacing(2),
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between', // Сдвинуть кнопку вниз, если контент короткий
//     overflowY: 'auto', // Разрешить прокрутку описания/других деталей независимо
//     [theme.breakpoints.down('sm')]: {
//       width: '100%',
//       paddingTop: theme.spacing(1),
//     }
//   },
//   title: {
//     marginBottom: theme.spacing(1)
//   },
//   description: {
//     flexGrow: 1, // Разрешить описанию занимать доступное вертикальное пространство
//     marginBottom: theme.spacing(2)
//   }
// }));

// export default function NFTModalContent({ nft, onClick }) {
//   const classes = useStyles();

//   if (!nft) {
//     return null;
//   }

//   return (
//     <Paper className={classes.root}>
//       <Grid container className={classes.mainContainer}>
//         <Grid item className={classes.imageContainer}>
//           {nft.image && (
//             <Image
//               src={nft.image}
//               alt={nft.title || 'NFT Image'}
//               layout='fill'
//               objectFit='contain'
//             />
//           )}
//         </Grid>

//         <Grid item className={classes.contentContainer}>
//           <Typography variant="h5" component="h2" id="nft-modal-title" className={classes.title}>
//             {nft.title}
//           </Typography>
//           <Typography variant="body2" className={classes.description}>
//             {nft.description || 'No description available for this NFT.'}
//           </Typography>

//           {/* Добавляем отображение количества экземпляров, если это ERC-1155 */}
//           {nft.isERC1155 && ( // Проверяем, является ли NFT ERC-1155
//             <Typography variant="subtitle1">
//               Количество: {nft.quantity || 1} {/* Отображаем количество, если оно есть */}
//             </Typography>
//           )}

//           <Button variant="contained" color="primary" onClick={onClick} fullWidth>
//             Закрыть
//           </Button>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// }