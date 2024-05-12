import { useState, useEffect } from 'react'
import axios from 'axios';
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { getparamPend } from 'src/@core/utils/encp';
import Swal from 'sweetalert2';


const printdetail = (props) => {

  const [datasiswa, setDataSiswa] = useState([])
  const [datatagihan, saetDatatagihan] = useState([])

  useEffect(() => {
    Callsiswa()
    Calldetailbayar()
  }, [])
  const Callsiswa = async () => {
    await axios.get(`${process.env.APP_API}siswa/edit/${props.id}`, {
      headers: {
        Authorization: `bearer ${localStorage.getItem("accessToken")}`
      },

    }, {
      params: {
        id_siswa: props.id
      }
    }).then((data) => {
      setDataSiswa(data.data)
    }).catch((err) => {
      Swal.fire('Info', 'Gagal mendapatkan data', 'info')
      console.log(err)
    })
  }
  const Calldetailbayar = async () => {
    await axios.post(`${process.env.APP_API}/tagihan/detail/${props.id}`, {
      id_siswa: props.id
    }, {
      headers: {
        Authorization: `bearer ${localStorage.getItem("accessToken")}`
      }
    }).then((data) => {
      saetDatatagihan(data.data)
    }).catch((err) => {
      Swal.fire('Info', 'Gagal mendapatkan data', 'info')
      console.log(err)
    })
  }


  const style = `body {
    margin: 0;
    padding: 0;
    color: #000;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9.5px;
    font-weight: bold;

  }

h1 {
    margin: 5px 0 3px 0;
    padding: 0;
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
}

h3 {
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 10px;
}

p {
    margin: 0;
    padding: 0;
    line-height: 1.3;
    font-size: 9.5px;
    text-align: center;
}

hr {
    width: 100%;
    margin: 3px 0;
    padding: 0;
    border-top: 1px solid #000;
}

table {
    width: 100%;
    margin: 0;
    page-break-inside: auto;
}

tr {
    page-break-inside: avoid;
    page-break-after: auto;
}

thead>tr>td {
    margin: 0;
    padding: 3px 3px;
    text-transform: uppercase;
    text-align: center;
    font-size: 7.7px;
    font-weight: 400;
    background: #e7e7e7;
    border: 1px solid #e7e7e7;
}

tbody>tr>td {
    margin: 0;
    padding: 1.5px;
    font-size: 9px;
}

.thead {
    margin: 0;
    padding: 3px 3px;
    text-transform: uppercase;
    text-align: left;
    font-size: 7.7px;
    font-weight: 400;
    background: #e7e7e7;
    border: 1px solid #e7e7e7;
}

.width-auto {
    width: 65px;
}

.margin-auto {
    margin: 0 0 4px 0;
}

.font-auto {
    font-size: 9.5px;
}

#print {
    margin: 0;
    height: auto;
    padding: 0 5px 20px 5px;
}`;


  return (<>

    <div id="print">
      <table>
        <tbody><tr>
          <td>
            <h1>
              SIAKAD AKADEMIK
            </h1>
            <p>
              Sekolah Islam Terpadu Darul Maza
              <br />
              Jl. Nusantara Raya No.17 DKI Jakarta
            </p>
          </td>
        </tr>
        </tbody></table>
      <hr />
      <table>
        <tbody><tr>
          <td style={{ marginBottom: 0, paddingBottom: 0, textAlign: 'center' }}>
            <h3 style={{ margin: 0, padding: 0, fontSize: 11 }}>
              Bukti Pembayaran
            </h3>
            <h3 style={{ margin: 0, padding: 0 }}>
              No: 3769
            </h3>
          </td>
        </tr>
        </tbody></table>
      <table style={{ margin: '-3px 0 0 0' }}>
        <tbody>
          <tr>
            <td className="width-auto font-auto">
              Nama
            </td>
            <td className="font-auto">
              : {datasiswa.nama}
            </td>
            <td className="font-auto">
              Unit
            </td>
            <td className="font-auto">
              : {getparamPend(datasiswa.id_majors)}
            </td>
          </tr>
          <tr>
            <td className="width-auto font-auto">
              No. Induk
            </td>
            <td className="font-auto">
              : 23071600029
            </td>
            <td className="font-auto">
              Kelas
            </td>
            <td className="font-auto">
              : 10 - A
            </td>
          </tr>
        </tbody>
      </table>
      <hr style={{ marginBottom: 3, border: 0, borderBottom: '1.5px dotted #000' }} />
      <table className="margin-auto">
        <tbody>
          <tr>
            <td style={{ padding: '0 0 0 7px', textAlign: 'left' }}>
              1.
            </td>
            <td style={{ padding: 0 }}>
              SPP Februari 2023
            </td>
            <td style={{ padding: 0, textAlign: 'right' }}>
              :
            </td>
            <td style={{ padding: '0 12px 0 0', textAlign: 'right' }}>
              500,000
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0 0 0 7px', textAlign: 'left' }}>
              2.
            </td>
            <td style={{ padding: 0 }}>
              SPP Februari 2023
            </td>
            <td style={{ padding: 0, textAlign: 'right' }}>
              :
            </td>
            <td style={{ padding: '0 12px 0 0', textAlign: 'right' }}>
              500,000
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ padding: 0 }} />
            <td style={{ paddingRight: 12 }}>
              <hr style={{ border: 0, borderBottom: '1.5px dotted #000' }} />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: '0 10px 0 0', textAlign: 'right' }}>
              <h3>
                TOTAL
              </h3>
            </td>
            <td style={{ width: 10, padding: 0, textAlign: 'right' }}>
              :
            </td>
            <td style={{ width: 'auto', minWidth: 50, padding: '0 12px 0 0', textAlign: 'right' }}>
              Rp 500,000
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td className="width-auto font-auto">
              Metode Bayar
            </td>
            <td className="font-auto">
              : {datasiswa.pembayaran_method}
            </td>
          </tr>
          <tr>
            <td className="font-auto">
              Waktu Bayar
            </td>
            <td className="font-auto">
              :  {datasiswa.pembayaran_date}
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ paddingRight: 12, fontSize: 9, textAlign: 'right' }}>
        {datasiswa.pembayaran_date}
      </p>
      <p style={{ marginTop: 45, paddingRight: 12, fontSize: 9, textAlign: 'right' }}>
        (Admin Operator)
      </p>
      <p style={{ marginTop: 5, paddingLeft: 5, textAlign: 'left', fontSize: 8 }}>
        *Harap menyimpan bukti ini sebagai pembayaran yang sah
      </p>
    </div>
  </>
  )
}

printdetail.getLayout = page => <BlankLayout>{page}</BlankLayout>
export async function getServerSideProps(context) {
  const id = context.query.printdetail;
  return {
    props: {
      id
    }
  }
}
export default printdetail



