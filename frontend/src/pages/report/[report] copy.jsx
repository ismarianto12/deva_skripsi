import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Peserta = () => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        // Your Bearer token
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost/siakad_sdit/public/api/v1/ppdb/report/1', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Add other headers if needed
          },
          // Add any request body if required
        });

        // console.log(response.ok, 'response')
        // if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        setFileData(new Uint8Array(arrayBuffer));
        // } else {
        //   console.error('Failed to fetch the file.');
        // }
      } catch (error) {
        console.error('An error occurred while fetching the file.', error);
      }
    };

    fetchFile();
  }, []);

  return (
    <div>
      {fileData ? (
        <Document
          file={{ data: fileData }}
          options={{ workerSrc: 'https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js' }}
        >
          <Page pageNumber={1} />
        </Document>
      ) : (
        <p>Loading PDF file...</p>
      )}
    </div>
  );
};
Peserta.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Peserta;
