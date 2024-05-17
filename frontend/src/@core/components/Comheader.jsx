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
    <Grid container xs={12} sx={{ 'marginTop': '20px' }}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          value={value}
          sx={{ width: '80%' }}
          placeholder='Search Data'
          onChange={(e) => handleFilter(e.target.value)}
        />

      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          variant='contained'
          sx={{ '& svg': { mr: 2 } }}
          onClick={() => route.push(url)}
        >
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Tambah
        </Button>
      </Grid>
    </Grid>
  )
}

export default Comheader
