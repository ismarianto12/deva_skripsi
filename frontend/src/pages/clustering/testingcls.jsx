import React, { useEffect, useState } from 'react';
import kmeansEngine from 'kmeans-engine';

const DataKMeans = () => {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    // Data yang digunakan untuk clustering
    const data = [
      [755, 500, 255],
      [600, 500, 100],
      // Tambahkan data lainnya di sini
    ];

    // Konfigurasi clustering K-Means
    const options = { maxIterations: 100 };

    // Melakukan clustering
    const kmeans = new KMeans();
    const { centroids, clusters } = kmeans.cluster(data, 3, options);
    // Menyimpan hasil clustering ke state
    setClusters(clusters);
  }, []); // Memastikan useEffect hanya dijalankan sekali setelah komponen dipasang

  return (
    <div>
      <h2>Hasil Clustering K-Means:</h2>
      <ul>
        {clusters.map((cluster, index) => (
          <li key={index}>
            Cluster {index + 1}: {cluster.length} titik data
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataKMeans;
