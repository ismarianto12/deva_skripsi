// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        background: '#fff',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img src="/logo_app.png"
        style={{
          'width': '25%',
        }}
      />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
