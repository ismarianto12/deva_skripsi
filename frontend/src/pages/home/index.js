// ** MUI Import
import Grid from '@mui/material/Grid'

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

// ** Custom Component Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

const CrmDashboard = () => {
  return (
    <>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={6} sm={6} lg={3}>
            <CrmSalesWithAreaChart />
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <CrmSessions />
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <CardStatsVertical
              stats='500'
              chipText='-12.2%'
              chipColor='default'
              avatarColor='error'
              title='Total Tagihan'
              subtitle='Last week'
              avatarIcon='tabler:currency-dollar'
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <CardStatsVertical
              stats='24.67k'
              chipText='+25.2%'
              avatarColor='info'
              chipColor='default'
              title='Total Pucahsing'
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