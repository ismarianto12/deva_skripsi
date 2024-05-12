// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

const Comheader = props => {
  // ** Props
  const route = useRouter()
  const { handleFilter, value } = props

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
        justifyContent: 'space-between'
      }}
    >
      <Button variant='contained' sx={{ '& svg': { mr: 2 } }}
        onClick={() =>
          route.push('/galery/create')
        }
      >
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        Tambah
      </Button>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search'
          onChange={e => handleFilter(e.target.value)}
        />


      </Box>
    </Box>
  )
}

export default Comheader
