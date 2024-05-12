// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

const TableHeader = props => {
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
      <Button color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
        Export
      </Button>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search'
          onChange={e => handleFilter(e.target.value)}
        />

        <Button variant='contained' sx={{ '& svg': { mr: 2 } }}
          onClick={() =>
            route.push('/cabang/create')
          }
        >
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Tambah
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
