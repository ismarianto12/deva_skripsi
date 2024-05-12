import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid } from '@mui/material';

const Cainprov = (props) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  useEffect(() => {
    axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => setProvinces(response.data));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`)
        .then((response) => setDistricts(response.data));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedDistrict}.json`)
        .then((response) => setSubdistricts(response.data));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSubdistrict) {
      axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedSubdistrict}.json`)
        .then((response) => setVillages(response.data));
    }
  }, [selectedSubdistrict]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
        <FormControl fullWidth>
          <InputLabel>Provinsi:</InputLabel>
          <Select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <MenuItem value="">Pilih Provinsi</MenuItem>
            {provinces.map((province) => (
              <MenuItem key={province.id} value={province.name}>
                {province.name}
              </MenuItem>
            ))}
          </Select>
          {props.errors.provinsi && <FormHelperText error>Silahkan pilih provinsi</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
        <FormControl fullWidth>
          <InputLabel>Kabupaten:</InputLabel>
          <Select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <MenuItem value="">Pilih Kabupaten</MenuItem>
            {districts.map((district) => (
              <MenuItem key={district.id} value={district.name}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
          {props.errors.kabupaten && <FormHelperText error>Silahkan pilih kabupaten</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
        <FormControl fullWidth>
          <InputLabel>Kecamatan:</InputLabel>
          <Select
            value={selectedSubdistrict}
            onChange={(e) => setSelectedSubdistrict(e.target.value)}
          >
            <MenuItem value="">Pilih Kecamatan</MenuItem>
            {subdistricts.map((subdistrict) => (
              <MenuItem key={subdistrict.id} value={subdistrict.name}>
                {subdistrict.name}
              </MenuItem>
            ))}
          </Select>
          {props.errors.kecamatan && <FormHelperText error>Silahkan pilih Kecamatan</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
        <FormControl fullWidth>
          <InputLabel>Kelurahan:</InputLabel>
          <Select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
          >
            <MenuItem value="">Pilih Kelurahan</MenuItem>
            {villages.map((village) => (
              <MenuItem key={village.id} value={village.name}>
                {village.name}
              </MenuItem>
            ))}
          </Select>
          {props.errors.kelurahan && <FormHelperText error>Silahkan pilih kelurahan</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default Cainprov;
