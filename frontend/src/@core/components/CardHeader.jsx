const CardHeader = props => {

  const { data } = props //implements by array

  return (<>
    <Grid container spacing={2}>
      {data.map((jdata, i) => {
        return (<Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={`${jdata['label']}`}
            trendDiff='-14'
            trend='negative'
            title={`${jdata['sublabel']}`}
            avatarColor={`${jdata['color']}`}
            icon='tabler:user-check'
            subtitle='Last week analytics'
          />
        </Grid>)
      })}
    </Grid>

  </>)
}

export default CardHeader
