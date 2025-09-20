import { Typography } from '@mui/material'

export default function TokenName ({ name }) {
  return (
    <Typography
      gutterBottom
      variant="h5"
      component="div"
      >
        {name}
    </Typography>
  )
}