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
      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtLCr2u2upCyFV_qaAi-VDAj_zlp4V0daCi0lpzef0GiWZSBoo3S5IKjs3aT4WeF8VPQS9LsTXpsfN51XF104bbbfyGMhhKp_ryOlgiWVkQjYVotioOOMwHALuvolRyfigpdRHREuaqEs/s1600/sumber+jaya+palur.jpg"
        style={{
          'width': '25%',
        }}
      />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
