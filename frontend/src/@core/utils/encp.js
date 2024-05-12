import axios from 'axios';
import crypto from 'crypto'
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

function generateMD5Hash(dataToHash) {
  const md5Hash = crypto.createHash('md5').update(dataToHash).digest('hex');
  return md5Hash;
}


async function getToken() {
  const tokendata = localStorage.getItem('accessToken');
  if (tokendata) {
    return tokendata
  } else {
    return null
  }
}

function getUserlogin(parameter) {
  const userDataJSON = localStorage.getItem("userData");
  if (userDataJSON) {
    const userData = JSON.parse(userDataJSON);
    return userData[0][parameter] ? userData[0][parameter] : 'Kosong'
  }
  return null; // You can return null or any default value you prefer
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookieName = `${name}=`;
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.startsWith(cookieName)) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null; // Cookie not found
}
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
const calluser = async (props) => {
  await axios.post(`${process.env.APP_API}level/list`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
  }).then((data) => {
    props.setLevelakses(data.data)
  }).catch((err) => {
    toast.error('Gagal Mengambil level user ...' + err)
    props.setLevelakses([])
  })
}
const calluserEdit = async (props) => {
  // console.log(props.id, 'pasising id nya')
  await axios.post(`${process.env.APP_API}user/edit/${props.id}`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
  }).then((data) => {
    props.setEditdata(data.data)
  }).catch((err) => {
    toast.error('Gagal Mengambil data  user ...' + err)
    props.setEditdata([])
  })
}

// bagian pppdb online

const prosesPpdb = async (props) => {

  await axios.post(`${process.env.APP_API}ppdb/insertsiswa/${props.idpdb}`, {
    status: props.status
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
  }).then((data) => {
    Swal.fire({
      title: 'Proses ' + props.status,
      html: 'Sedang memproses',
      allowOutsideClick: false,
    });
    Swal.showLoading()
    setTimeout(() => {
      Swal.close()
    }, 3000)

    props.route.push('/ppdb/list')
  }).catch((err) => {
    toast.error(`data saudah terdaftar sebelumnya`)
  })
}

const getparamPend = (params) => {
  const listdata = {
    '1': 'TKA',
    '2': 'TKB',
    '3': 'SD',
    '4': 'MTS IT',
    '5': 'TKA',
  };

  return listdata[params] || 'Nilai tidak ditemukan';
}
// acceess data
const GetUnit = async (props) => {
  try {
    const response = await axios.get(`${process.env.APP_API}tingkat/list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    // Assuming the data is an array, if not, adjust accordingly
    props.setUnitdata(response.data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching unit data:', error);
    toast.error('Tidak dapat memanggil data unit: ' + error.message);
  }
};

const GetTahunAkademik = async (props) => {

  await axios.get(`${process.env.APP_API}tahunakademik/list`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then((data) => {
    props.setTahunajaran([data.data])
  }).catch((err) => {
    toast.error('tidak dapat memanggil data');
  })
}

const GetKelas = async props => {
  console.log(props, 'detail props')
  await axios.get(`${process.env.APP_API}kelas/list`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then((data) => {
    props.setKelas([data.data])
  }).catch((err) => {
    toast.error('tidak dapat memanggil data');
  })
}
export {
  getparamPend,
  generateMD5Hash,
  getUserlogin,
  setCookie,
  calluser,
  getCookie,
  deleteCookie,
  calluserEdit,
  prosesPpdb,
  GetUnit,
  GetTahunAkademik,
  GetKelas
}









