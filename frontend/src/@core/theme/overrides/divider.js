const Divider = () => {
  return {
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiStack-root &:not(.MuiDivider-vertical)': {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
          }
        }),
        middle: ({ theme }) => ({
          '&:not(.MuiDivider-vertical)': {
            marginLeft: theme.spacing(0),
            marginRight: theme.spacing(0)
          },
          '&.MuiDivider-vertical': {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
          }
        })
      }
    }
  }
}

export default Divider
