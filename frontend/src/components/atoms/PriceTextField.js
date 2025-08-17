import { TextField } from '@mui/material';

export default function PriceTextField({ onChange, disabled, error, value, sx }) {
  return (
    <TextField
      id="price-per-unit-input"
      label="Цена за шт." // Явно указываем, что это цена за штуку
      name="pricePerUnit"
      size="small"
      // fullWidth // Удалено
      required={!disabled}
      margin="dense"
      type="number"
      inputProps={{ step: 'any', min: 0 }} // Цена может быть 0 для бесплатных токенов
      disabled={disabled}
      onChange={onChange}
      error={error}
      value={value}
      sx={sx}
    />
  );
}