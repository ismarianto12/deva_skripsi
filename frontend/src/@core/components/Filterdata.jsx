import { useEffect } from 'react'
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios'
import { useRouter } from 'next/router'
import Action from 'src/store/action';
import {
  GetUnit,
  GetTahunAkademik,
  GetKelas
} from 'src/@core/utils/encp'

const Filterdata = (
  {
    divis,
    datadivisi,
    handleFilter,
    show,
    unitdata,
    kelas,
    tahunajaaran,
    setShow,
    setUnitdata,
    setTahunajaran,
    setKelas,
    setDivisi,
    setKata,
    payload,
    setPayload,
    urlparameter,
    fetchTableData
  }
) => {
  const route = useRouter()
  useEffect(() => {

    const GetUnit = async (props) => {
      try {
        const response = await axios.get(`${process.env.APP_API}tingkat/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        setUnitdata(response.data)
      } catch (error) {
        toast.error('Tidak dapat memanggil data unit: ' + error.message);
      }
    };

    const GetTahunAkademik = async (props) => {

      await axios.get(`${process.env.APP_API}tahunakademik/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).then((data) => {
        setTahunajaran(data.data)
      }).catch((err) => {
        toast.error('tidak dapat memanggil data');
      })
    }


    GetUnit()
    GetTahunAkademik()
    // GetKelas()
  }, [])


  const handleClear = () => {
    // route.push(`${urlparameter}`)

    // setPayload({
    //   unit: '',
    //   class_name: '',
    //   class_year: '',
    //   status: ''
    // })
    const queryiput = document.querySelector('value')
    setPayload({
      ...payload,
      [queryiput]: ''
    });

  }
  const handleChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value
    });
  }


  const searchKelas = async (e) => {
    setKelas([])
    handleChange(e)
    const dataunit_id = e.target.value
    const restkelas = await Action().callKelas(dataunit_id)
    // setUnitid(dataunit_id)
    setKelas(restkelas)

  }


  return (<>
    <div className="accordion mb-3">
      <div className="accordion-item">
        <div className="accordion-header">
          <h2 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#tab-filter" aria-expanded="true" style={{ cursor: 'pointer' }} onClick={() => setShow((show) => !show)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-filter" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" />
            </svg>
            Filter Data
          </h2>
        </div>
        <div id="tab-filter" className={`accordion-collapse collapse ${show ? '' : 'show'}`} style={{}}>
          <div className="accordion-body pt-0">
            <form id="filter-form" action="javascript:void(0)">
              <div className="row">
                <div className="col-sm-6 col-md-2 mb-3">
                  <label className="form-label">Kata Kunci</label>
                  <input type="text" name="keyword" onChange={handleChange} id="keyword" className="form-control" placeholder="Masukan kata kunci pencarian" maxLength={64} />
                </div>
                <div className="col-sm-6 col-md-2 mb-3">
                  <label className="form-label">
                    Pilih Unit
                  </label>
                  <select name="unit" id="filter-unit" className="form-select" onChange={(e)=>
                   searchKelas(e)
                    }>
                    <option value={``}></option>
                    {unitdata?.map((data) =>
                    (
                      <option value={`${data?.id}`}>{data?.tingkat}</option>
                    )

                    )}
                  </select>
                </div>
                <div className="col-sm-6 col-md-2 mb-3">
                  <label className="form-label">
                    Pilih Kelas
                  </label>
                  <select name="class_name" id="class-name" className="form-select" onChange={handleChange}>
                    <option value={``}></option>

                    {kelas?.map((data) => {
                      return (
                        <option value={`${data?.id}`}>{data?.kelas}-{data?.tingkat}</option>
                      )
                    }
                    )}
                  </select>
                </div>
                <div className="col-sm-6 col-md-2 mb-4">
                  <label className="form-label">
                    Tahun Ajaran
                  </label>
                  <select name="class_year" id="class-year" className="form-select" onChange={handleChange}>
                    <option value={``}></option>
                    {tahunajaaran?.map((data) => (
                      <option value={data?.id} key={data?.tahun}>
                        {data?.tahun}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-6 col-md-2 mb-4">
                  <label className="form-label">
                    Status Siswa
                  </label>
                  <select name="status" id="status" className="form-select" onChange={handleChange}>
                    <option value={``}></option>

                    <option value="A" selected>Aktif</option>
                    <option value="L">Lulus</option>
                    <option value="K">Keluar</option>
                    <option value="D">Dihapus</option>
                    <option value="all">Semua</option>
                  </select>
                </div>
                <div className="col-12">
                  <button type="button" id="btn-apply-filter" onClick={handleFilter} className="btn btn-primary">
                    Terapkan Filter
                  </button>
                  <button type="reset" onClik={()=> fetchTableData()} id="btn-reset-filter" onClick={handleFilter} className="btn btn-default ms-2">
                    Reset Filter
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default Filterdata
