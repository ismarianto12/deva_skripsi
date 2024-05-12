import { useState, useEffect } from 'react'
import axios from 'axios'

const indexProvince = (
  provinsi_id
) => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const selectedProvince = provinces[provinsi_id] || {};
  return selectedProvince?.name
}

const indexKabupaten = (
  id_provinsi,
  id_kabupaten
) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id_provinsi}.json`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const resdata = data[id_kabupaten] || {};
  return resdata?.name;

}

const indexKecamatan = (
  id_kabupaten,
  id_kecamatan
) => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id_kabupaten}.json`)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const returndata = provinces[id_kecamatan] || {};
  return returndata?.name;
}


const indexKelurahan = (

  id_kecamatan,
  id_keluarahan

) => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${id_kecamatan}.json`)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const returndata = provinces[id_keluarahan] || {};
  return returndata?.name;
}

export {
  indexProvince,
  indexKelurahan,
  indexKabupaten,
  indexKecamatan,
}
