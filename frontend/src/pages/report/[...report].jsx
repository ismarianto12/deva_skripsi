import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Preloading from 'src/@core/components/Preloading';
import { useRouter } from 'next/router';


const Report = (props) => {
  const [pdfData, setPdfData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const nextElement = document.getElementById('__next');
    if (nextElement) {
      nextElement.style.backgroundColor = '#ffff'; // Ubah background menjadi warna putih
    }
    const fetchPdf = async () => {
      const { report } = router.query; // Mengambil nilai parameter dinamis dari URL
      const jenisreport = router?.query?.jenisreport;
      console.log(`${process.env.APP_API}report/barang/print/${props.id[0]}`, 'jenis report')
      try {
        if (props?.id[1] === 'purchasing') {
          document.title = "Purchase Order"
          const response = await axios.post(`${process.env.APP_API}master/purchasing/print/${props.id[0]}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            responseType: 'arraybuffer', // Important for PDF files
          });
          const base64String = Buffer.from(response.data, 'binary').toString('base64');
          setPdfData(base64String);
          setLoading(false)
        } else if (props.id[1] === 'barang') {
          document.title = "Data Barang Ready Stock"
          const response = await axios.post(`${process.env.APP_API}report/barang/print/${props.id[0]}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            responseType: 'arraybuffer', // Important for PDF files
          });
          const base64String = Buffer.from(response.data, 'binary').toString('base64');
          setPdfData(base64String);
          setLoading(false)
        } else if (props.id[1] == 'distributor') {
          document.title = "Laporan Data Ditributor"
          const response = await axios.post(`${process.env.APP_API}report/distributor/print/${props.id[0]}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            responseType: 'arraybuffer', // Important for PDF files
          });
          const base64String = Buffer.from(response.data, 'binary').toString('base64');
          setPdfData(base64String);
          setLoading(false)

        } else {
          setError('Error fetching PDF');
        }
      } catch (error) {
        setError('Error fetching PDF');
        console.error('Error fetching PDF:', error);
      }
    };
    fetchPdf();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {pdfData && (
        <iframe src={`data:application/pdf;base64,${pdfData}`} width="100%" height="1000px" type="application/pdf" title="Purchasing Report" style={{ 'border': 'none' }} />
      )}
      {loading ? (

        <div style={{ 'margin': '0 auto' }}>
          <br /><br />
          <h1 style={{ 'textAlign': 'center', 'margin': '0 auto' }}>Loading Report</h1><img src="https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif" />
        </div>
      ) : null}
    </div>
  );
};

export async function getServerSideProps(context) {
  const id = context.query.report;
  return {
    props: {
      id
    },
  };
}

Report.getLayout = page => <BlankLayout>{page}</BlankLayout>
export default Report;
