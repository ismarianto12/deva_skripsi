// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';

const Comheader = (props) => {
  // Props
  const route = useRouter()
  const { handleFilter, value, url } = props

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Grid item xs={12} sm={6}>
        <Box sx={{ rowGap: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'right' }}>
          <CustomTextField
            value={value}
            sx={{ mr: 8 }}
            placeholder='Search Data'
            onChange={(e) => handleFilter(e.target.value)}
          />
        </Box>

      </Grid>
      <Grid item xs={12} sm={6}>

        <Button
          variant='contained'
          sx={{ '& svg': { mr: 2 } }}
          onClick={() => route.push(url)}
        >
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Tambah
        </Button>
      </Grid>
    </Box>
  )
}

export default Comheader
