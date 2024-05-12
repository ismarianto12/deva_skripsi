import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Snackbar from '@mui/material/Snackbar';

export default function Preloading({ show, info }) {
  const [opesnack, setOpentsnack] = React.useState(false);
  const Info = () => {
    return (
      <>
        <Snackbar open={opesnack} autoHideDuration={6000} onClose={handleClose}>
          <p> Status Loading</p>
        </Snackbar></>
    )
  }
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={show}
        onClick={() => setOpentsnack(true)}
      >
        <Card style={{ width: "200px" }}>
          <center>
            <CircularProgress
              color="inherit"
              style={{ marginTop: "30px", color: "green" }}
            />
            <p>{info ? info : 'Please Wait ...'}</p>
          </center>
        </Card>
      </Backdrop>
    </div>
  );
}
