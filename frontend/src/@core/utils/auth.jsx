import axios from 'axios';
import { getUserlogin } from './encp';





async function getAuthuser(props) {
  const userid = getUserlogin('id');
  const config = {
    method: 'post',
    url: `${process.env.APP_API}user/edit/${userid}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
    data: {
      userid: userid,
    }
  }
  const response = await axios(config);
  props.setUserdata(response.data);
  props.reset(response.data)

};

export { getAuthuser };
