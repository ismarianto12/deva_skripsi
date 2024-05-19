// ** MUI Import
import Grid from '@mui/material/Grid'
// ** Demo Component Imports
import CrmSessions from 'src/views/dashboards/crm/CrmSessions'
import CrmRevenueGrowth from 'src/views/dashboards/crm/CrmRevenueGrowth'
import CrmBrowserStates from 'src/views/dashboards/crm/CrmBrowserStates'
import CrmProjectStatus from 'src/views/dashboards/crm/CrmProjectStatus'
import CrmActiveProjects from 'src/views/dashboards/crm/CrmActiveProjects'
import CrmLastTransaction from 'src/views/dashboards/crm/CrmLastTransaction'
import CrmActivityTimeline from 'src/views/dashboards/crm/CrmActivityTimeline'
import CrmSalesWithAreaChart from 'src/views/dashboards/crm/CrmSalesWithAreaChart'
import CrmSalesWithRadarChart from 'src/views/dashboards/crm/CrmSalesWithRadarChart'
import CrmEarningReportsWithTabs from 'src/views/dashboards/crm/CrmEarningReportsWithTabs'
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { Card, CardContent, Typography } from '@mui/material'

const CrmDashboard = () => {
  return (
    <>
      <ApexChartWrapper>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h5' sx={{ mb: 0.5 }}>
                <Icon icon='tabler:files' fontSize='1.125rem' />
                Welcome Back Sistem Informasi Clustering Kmeans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <br />
        <Grid container spacing={6}>
          <Grid item xs={6} sm={6} lg={3}>
            <CrmSalesWithAreaChart />
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <CrmSessions />
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <CardStatsVertical
              stats='4'
              chipText=''
              chipColor='default'
              avatarColor='error'
              title='Total Clustering'
              subtitle='Last week'
              avatarIcon='tabler:currency-dollar'
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <CardStatsVertical
              stats='3'
              chipText='+25.2%'
              avatarColor='info'
              chipColor='default'
              title='Kriteria'
              subtitle='Last week'
              avatarIcon='tabler:chart-bar'
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <CrmEarningReportsWithTabs />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CrmSalesWithRadarChart />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  )
}


export default CrmDashboard
