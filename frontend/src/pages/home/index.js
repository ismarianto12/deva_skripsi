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
import { Card, CardContent, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import db from 'src/configs/database'
import { QueryTypes } from 'sequelize'

const CrmDashboard = (props) => {
  const { barangdata, distributor, clustering } = props.combinedData
  return (
    <>
      <ApexChartWrapper>
        <div data-aos="slide-left">
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
        </div>
        <br />

        <Grid container spacing={6}>
          <Grid item xs={6} sm={6} lg={3}>
            <div data-aos="slide-right">
              <CardStatsVertical
                stats={barangdata[0]?.jl}
                chipText='-12.2%'
                chipColor='default'
                avatarColor='success'
                title='Total Barang'
                subtitle='Last week'
                avatarIcon='tabler:cube'
              />
            </div>
          </Grid>

          <Grid item xs={6} sm={4} lg={3}>
            <div data-aos="slide-left">

              <CardStatsVertical
                stats={distributor[0]?.jl}
                chipText='-12.2%'
                chipColor='default'
                avatarColor='info'
                title='Total Distributor'
                subtitle='Last week'
                avatarIcon='tabler:bus'
              />
            </div>
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <div data-aos="slide-left">

              <CardStatsVertical
                stats={clustering[0]?.jl}
                chipText='-12.2%'
                chipColor='default'
                avatarColor='error'
                title='Total Cluster data'
                subtitle='Last week'
                avatarIcon='tabler:file'
              />
            </div>
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <div data-aos="slide-left">

              <CardStatsVertical
                stats='24.67k'
                chipText='+25.2%'
                avatarColor='info'
                chipColor='default'
                title='Total Pucahsing'
                subtitle='Last week'
                avatarIcon='tabler:chart-bar'
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={8}>
            <div data-aos="slide-left">

              <CrmEarningReportsWithTabs />
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <div data-aos="slide-left">

              <CrmSalesWithRadarChart />
            </div>
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    // Fetch data for the first table
    const barang = await db.query(`SELECT count(id) as jl FROM barang`, {
      type: QueryTypes.SELECT
    });


    // Fetch data for the second table
    const transaksi = await db.query(`SELECT count(id) as jl FROM transaksi`, {
      type: QueryTypes.SELECT
    });

    const distributor = await db.query(`SELECT count(id) as jl FROM distributor`, {
      type: QueryTypes.SELECT
    });

    const clustering = await db.query(`SELECT count(id) as jl FROM clustering_result`, {
      type: QueryTypes.SELECT
    });

    // Combine the fetched data
    const combinedData = {
      barangdata: JSON.parse(JSON.stringify(barang)),
      transaksi: JSON.parse(JSON.stringify(transaksi)),
      distributor: JSON.parse(JSON.stringify(distributor)),
      clustering: JSON.parse(JSON.stringify(clustering)),
    };
    return {
      props: {
        combinedData
      }
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        combinedData: { barangdata: [], transaksi: [], distributor: [], clustering: [] } // Return empty arrays for both tables if there's an error
      }
    };
  }
}

export default CrmDashboard
