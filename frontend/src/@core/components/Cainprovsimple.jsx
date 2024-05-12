import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cainprovsimple = (props) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  useEffect(() => {
    axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json') // Ganti URL API sesuai dengan sumber data yang Anda gunakan
      .then((response) => setProvinces(response.data));
  }, []);

  useEffect(() => {
    console.log(selectedProvince, 'target')
    if (selectedProvince) {
      axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`) // Ganti URL API sesuai dengan sumber data yang Anda gunakan
        .then((response) => setDistricts(response.data));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedDistrict}.json`)
        .then((response) => setSubdistricts(response.data))
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSubdistrict) {
      axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedSubdistrict}.json`) // Ganti URL API sesuai dengan sumber data yang Anda gunakan
        .then((response) => setVillages(response.data));
    }
  }, [selectedSubdistrict]);

  return (
    <div>
      <div className="form-group mb-4">
        <label>Provinsi:</label>
        <select
          className={`form-control ${props.errors.provinsi ? 'is-invalid' : ''}`}
          defaultValue={selectedProvince}
          {...props.register('provinsi', {
            required: true,
            onChange: (e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const dataValue = selectedOption.getAttribute('data');
              // console.log(dataValue, 'provinsi');
              setSelectedProvince(dataValue);
            }
          })}
        >
          <option value="">Pilih Provinsi</option>
          {provinces.map((province) => (
            <option key={province.id} data={province.id} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>


        {props.errors.provinsi && <div className="invalid-feedback">Silahkan pilih provinsi</div>}
      </div>
      <div className="form-group mb-4">
        <label>Kabupaten:</label>
        <select
          className={`form-control ${props.errors.kabupaten ? 'is-invalid' : ''}`}
          defaultValue={selectedDistrict}
          {...props.register('kabupaten', {
            required: true,
            onChange: (e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const dataValue = selectedOption.getAttribute('data');
              setSelectedDistrict(dataValue)
            }
          },
          )}
        >
          <option value="">Pilih Kabupaten</option>
          {districts.map((district) => (
            <option key={district.id} data={district.id} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
        {props.errors.kabupaten && <div className="invalid-feedback">Silahkan pilih kabupaten</div>}

      </div>
      <div className="form-group mb-4">
        <label>Kecamatan:</label>
        <select
          className={`form-control ${props.errors.kecamatan ? 'is-invalid' : ''}`}
          defaultValue={selectedSubdistrict}
          name="kecamatan"
          {...props.register('kecamatan', {
            required: true,
            onChange: (e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const dataValue = selectedOption.getAttribute('data');

              setSelectedSubdistrict(dataValue)
            }
          })}
        >
          <option value="">Pilih Kecamatan</option>
          {subdistricts.map((subdistrict) => (
            <option key={subdistrict.id} data={subdistrict.id} value={subdistrict.name}>
              {subdistrict.name}
            </option>
          ))}
        </select>
        {props.errors.kecamatan && <div className="invalid-feedback">Silahkan pilih Kecamatan</div>}

      </div>
      <div className="form-group mb-4">
        <label>Kelurahan:</label>
        <select
          className={`form-control ${props.errors.kelurahan ? 'is-invalid' : ''}`}
          defaultValue={selectedVillage}
          name="kelurahan"
          {...props.register('kelurahan', {
            required: true,
            onChange: (e) => setSelectedVillage(e.target.key)

          })}
        >
          <option value="">Pilih Kelurahan</option>
          {villages.map((village) => (
            <option key={village.id} value={village.name}>
              {village.name}
            </option>
          ))}
        </select>
        {props.errors.kelurahan && <div className="invalid-feedback">Silahkan pilih kelurahan</div>}

      </div>
    </div >
  );
}

export default Cainprovsimple;
