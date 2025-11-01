import { TextField } from '@mui/material';

export default function QuantityTextField({ onChange, disabled, error, value, min = 1, max, sx }) {
  const inputProps = {
    min: min,
    step: 1
  };

  // Добавляем max в inputProps только если он определен
  if (max !== undefined) {
    inputProps.max = max;
  }

  return (
    <TextField
      id="quantity-input"
      label= "Цена за шт." // Явно указываем, что это количество
      name="quantity"
      size="small"
      required={!disabled}
      margin="dense"
      type="number"
      inputProps={inputProps}
      disabled={disabled}
      onChange={onChange}
      error={error}
      value={value}
      sx={sx}
    />
  );
}



// import { TextField } from '@mui/material';

// export default function QuantityTextField({ onChange, disabled, error, value, min = 1, max, sx }) {
//   return (
//     <TextField
//       id="quantity-input"
//       label= "Цена за шт." // Явно указываем, что это количество
//       name="quantity"
//       size="small"
//       // fullWidth // Удалено
//       required={!disabled}
//       margin="dense"
//       type="number"
//       inputProps={{ min: min, max: max, step: 1 }} // Важно: шаг 1, мин 1
//       disabled={disabled}
//       onChange={onChange}
//       error={error}
//       value={value}
//       sx={sx}
//     />
//   );
// }