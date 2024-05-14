import React, { useEffect, useState } from 'react';
import kmeansEngine from 'kmeans-engine';


const data = [
  { KD: 'BR0001', SA: 755, SAK: 500, SKEL: 255 },
  { KD: 'BR0002', SA: 600, SAK: 500, SKEL: 100 },
  { KD: 'BR0003', SA: 730, SAK: 500, SKEL: 230 },
  { KD: 'BR0004', SA: 623, SAK: 500, SKEL: 123 },
  { KD: 'BR0005', SA: 1000, SAK: 500, SKEL: 500 },
  { KD: 'BR0006', SA: 420, SAK: 400, SKEL: 20 },
  { KD: 'BR0007', SA: 760, SAK: 400, SKEL: 360 },
  { KD: 'BR0008', SA: 515, SAK: 500, SKEL: 15 },
  { KD: 'BR0009', SA: 1000, SAK: 500, SKEL: 500 },
  { KD: 'BR0010', SA: 750, SAK: 600, SKEL: 150 },
  { KD: 'BR0011', SA: 580, SAK: 500, SKEL: 80 },
  { KD: 'BR0012', SA: 590, SAK: 500, SKEL: 90 },
  { KD: 'BR0013', SA: 700, SAK: 500, SKEL: 200 },
  { KD: 'BR0014', SA: 560, SAK: 500, SKEL: 60 },
  { KD: 'BR0015', SA: 1030, SAK: 500, SKEL: 530 },
  { KD: 'BR0016', SA: 535, SAK: 500, SKEL: 35 },
  { KD: 'BR0017', SA: 900, SAK: 600, SKEL: 300 },
  { KD: 'BR0018', SA: 1100, SAK: 700, SKEL: 400 },
  { KD: 'BR0019', SA: 420, SAK: 300, SKEL: 120 },
  { KD: 'BR0020', SA: 560, SAK: 500, SKEL: 60 },
  { KD: 'BR0021', SA: 720, SAK: 400, SKEL: 320 },
  { KD: 'BR0022', SA: 580, SAK: 500, SKEL: 80 },
  { KD: 'BR0023', SA: 219, SAK: 200, SKEL: 19 },
  { KD: 'BR0024', SA: 335, SAK: 300, SKEL: 35 },
  { KD: 'BR0025', SA: 512, SAK: 500, SKEL: 12 },
  { KD: 'BR0026', SA: 415, SAK: 400, SKEL: 15 },
  { KD: 'BR0027', SA: 330, SAK: 300, SKEL: 30 },
  { KD: 'BR0028', SA: 600, SAK: 500, SKEL: 100 },
  { KD: 'BR0029', SA: 490, SAK: 400, SKEL: 90 },
  { KD: 'BR0030', SA: 712, SAK: 700, SKEL: 12 },
  { KD: 'BR0031', SA: 500, SAK: 200, SKEL: 300 },
  { KD: 'BR0032', SA: 760, SAK: 700, SKEL: 60 },
  { KD: 'BR0033', SA: 390, SAK: 300, SKEL: 90 },
  { KD: 'BR0034', SA: 530, SAK: 500, SKEL: 30 },
  { KD: 'BR0035', SA: 411, SAK: 400, SKEL: 11 },
  { KD: 'BR0036', SA: 270, SAK: 200, SKEL: 70 },
  { KD: 'BR0037', SA: 630, SAK: 500, SKEL: 130 },
  { KD: 'BR0038', SA: 505, SAK: 500, SKEL: 5 },
  { KD: 'BR0039', SA: 1035, SAK: 800, SKEL: 235 },
  { KD: 'BR0040', SA: 450, SAK: 400, SKEL: 50 },
  { KD: 'BR0041', SA: 734, SAK: 500, SKEL: 234 },
  { KD: 'BR0042', SA: 367, SAK: 300, SKEL: 67 },
  { KD: 'BR0043', SA: 823, SAK: 400, SKEL: 423 },
  { KD: 'BR0044', SA: 1061, SAK: 300, SKEL: 761 },
  { KD: 'BR0045', SA: 113, SAK: 100, SKEL: 13 },
  { KD: 'BR0046', SA: 108, SAK: 100, SKEL: 8 },
  { KD: 'BR0047', SA: 110, SAK: 100, SKEL: 10 },
  { KD: 'BR0048', SA: 135, SAK: 100, SKEL: 35 },
  { KD: 'BR0049', SA: 124, SAK: 100, SKEL: 24 },
  { KD: 'BR0050', SA: 290, SAK: 200, SKEL: 90 },
  { KD: 'BR0051', SA: 157, SAK: 100, SKEL: 57 },
  { KD: 'BR0052', SA: 307, SAK: 300, SKEL: 7 },
  { KD: 'BR0053', SA: 546, SAK: 500, SKEL: 46 },
  { KD: 'BR0054', SA: 500, SAK: 200, SKEL: 300 },
  { KD: 'BR0055', SA: 309, SAK: 300, SKEL: 9 },
  { KD: 'BR0056', SA: 319, SAK: 300, SKEL: 19 },
  { KD: 'BR0057', SA: 304, SAK: 300, SKEL: 4 },
  { KD: 'BR0058', SA: 306, SAK: 300, SKEL: 6 },
  { KD: 'BR0059', SA: 278, SAK: 200, SKEL: 78 },
  { KD: 'BR0060', SA: 390, SAK: 300, SKEL: 90 },
  { KD: 'BR0061', SA: 322, SAK: 200, SKEL: 122 },
  { KD: 'BR0062', SA: 290, SAK: 200, SKEL: 90 },
  { KD: 'BR0063', SA: 167, SAK: 100, SKEL: 67 },
  { KD: 'BR0064', SA: 287, SAK: 200, SKEL: 87 },
  { KD: 'BR0065', SA: 345, SAK: 300, SKEL: 45 },
  { KD: 'BR0066', SA: 542, SAK: 200, SKEL: 342 },
  { KD: 'BR0067', SA: 123, SAK: 100, SKEL: 23 },
  { KD: 'BR0068', SA: 108, SAK: 100, SKEL: 8 },
  { KD: 'BR0069', SA: 109, SAK: 100, SKEL: 9 },
  { KD: 'BR0070', SA: 276, SAK: 200, SKEL: 76 },
  { KD: 'BR0071', SA: 389, SAK: 300, SKEL: 89 },
  { KD: 'BR0072', SA: 243, SAK: 200, SKEL: 43 },
  { KD: 'BR0073', SA: 150, SAK: 100, SKEL: 50 },
  { KD: 'BR0074', SA: 104, SAK: 100, SKEL: 4 },
  { KD: 'BR0075', SA: 209, SAK: 200, SKEL: 9 },
  { KD: 'BR0076', SA: 134, SAK: 100, SKEL: 34 },
  { KD: 'BR0077', SA: 154, SAK: 100, SKEL: 54 },
  { KD: 'BR0078', SA: 201, SAK: 200, SKEL: 1 },
  { KD: 'BR0079', SA: 134, SAK: 100, SKEL: 34 },
  { KD: 'BR0080', SA: 153, SAK: 100, SKEL: 53 },
  { KD: 'BR0081', SA: 222, SAK: 200, SKEL: 22 },
  { KD: 'BR0082', SA: 212, SAK: 200, SKEL: 12 },
  { KD: 'BR0083', SA: 311, SAK: 300, SKEL: 11 },
  { KD: 'BR0084', SA: 310, SAK: 300, SKEL: 10 },
  { KD: 'BR0085', SA: 436, SAK: 400, SKEL: 36 },
  { KD: 'BR0086', SA: 410, SAK: 400, SKEL: 10 },
  { KD: 'BR0087', SA: 325, SAK: 300, SKEL: 25 },
  { KD: 'BR0088', SA: 112, SAK: 100, SKEL: 12 },
  { KD: 'BR0089', SA: 179, SAK: 100, SKEL: 79 },
  { KD: 'BR0090', SA: 130, SAK: 100, SKEL: 30 },
  { KD: 'BR0091', SA: 256, SAK: 200, SKEL: 56 },
  { KD: 'BR0092', SA: 214, SAK: 200, SKEL: 14 },
  { KD: 'BR0093', SA: 225, SAK: 100, SKEL: 125 },
  { KD: 'BR0094', SA: 600, SAK: 300, SKEL: 300 },
  { KD: 'BR0095', SA: 570, SAK: 500, SKEL: 70 },
  { KD: 'BR0096', SA: 189, SAK: 100, SKEL: 89 },
  { KD: 'BR0097', SA: 165, SAK: 100, SKEL: 65 },
  { KD: 'BR0098', SA: 150, SAK: 100, SKEL: 50 },
  { KD: 'BR0099', SA: 104, SAK: 100, SKEL: 4 },
  { KD: 'BR0100', SA: 218, SAK: 200, SKEL: 18 },
  { KD: 'BR0101', SA: 280, SAK: 200, SKEL: 80 },
  { KD: 'BR0102', SA: 107, SAK: 100, SKEL: 7 },
  { KD: 'BR0103', SA: 105, SAK: 100, SKEL: 5 },
  { KD: 'BR0104', SA: 114, SAK: 100, SKEL: 14 },
  { KD: 'BR0105', SA: 129, SAK: 100, SKEL: 29 },
  { KD: 'BR0106', SA: 205, SAK: 200, SKEL: 5 },
  { KD: 'BR0107', SA: 260, SAK: 200, SKEL: 60 },
  { KD: 'BR0108', SA: 106, SAK: 100, SKEL: 6 },
  { KD: 'BR0109', SA: 102, SAK: 100, SKEL: 2 },
  { KD: 'BR0110', SA: 128, SAK: 50, SKEL: 78 },
  { KD: 'BR0111', SA: 59, SAK: 50, SKEL: 9 },
  { KD: 'BR0112', SA: 72, SAK: 70, SKEL: 2 },
  { KD: 'BR0113', SA: 64, SAK: 60, SKEL: 4 },
  { KD: 'BR0114', SA: 100, SAK: 50, SKEL: 50 },
  { KD: 'BR0115', SA: 140, SAK: 50, SKEL: 90 },
  { KD: 'BR0116', SA: 104, SAK: 70, SKEL: 34 },
  { KD: 'BR0117', SA: 106, SAK: 80, SKEL: 26 },
  { KD: 'BR0118', SA: 171, SAK: 90, SKEL: 81 },
  { KD: 'BR0119', SA: 118, SAK: 100, SKEL: 18 },
  { KD: 'BR0120', SA: 101, SAK: 60, SKEL: 41 },
  { KD: 'BR0121', SA: 85, SAK: 70, SKEL: 15 },
  { KD: 'BR0122', SA: 121, SAK: 100, SKEL: 21 },
  { KD: 'BR0123', SA: 86, SAK: 50, SKEL: 36 },
  { KD: 'BR0124', SA: 74, SAK: 40, SKEL: 34 },
  { KD: 'BR0125', SA: 123, SAK: 100, SKEL: 23 },
  { KD: 'BR0126', SA: 550, SAK: 50, SKEL: 500 },
  { KD: 'BR0127', SA: 48, SAK: 40, SKEL: 8 },
  { KD: 'BR0128', SA: 196, SAK: 30, SKEL: 166 },
  { KD: 'BR0129', SA: 104, SAK: 100, SKEL: 4 },
  { KD: 'BR0130', SA: 127, SAK: 100, SKEL: 27 },
  { KD: 'BR0131', SA: 152, SAK: 150, SKEL: 2 },
  { KD: 'BR0132', SA: 216, SAK: 200, SKEL: 16 },
  { KD: 'BR0133', SA: 74, SAK: 50, SKEL: 24 },
  { KD: 'BR0134', SA: 175, SAK: 100, SKEL: 75 },
  { KD: 'BR0135', SA: 67, SAK: 60, SKEL: 7 },
  { KD: 'BR0136', SA: 123, SAK: 80, SKEL: 43 },
  { KD: 'BR0137', SA: 82, SAK: 60, SKEL: 22 },
  { KD: 'BR0138', SA: 85, SAK: 80, SKEL: 5 },
  { KD: 'BR0139', SA: 107, SAK: 90, SKEL: 17 },
];

const centroids = [
  { centroid: 'C1', SA: 1000, SAK: 500, SKEL: 500 },
  { centroid: 'C2', SA: 415, SAK: 400, SKEL: 15 },
  { centroid: 'C3', SA: 212, SAK: 200, SKEL: 12 },
];


const ClusterData = () => {
  function kMeans(data, k) {
    // Initialize centroids randomly
    const centroids = [];
    for (let i = 0; i < k; i++) {
      centroids.push(data[Math.floor(Math.random() * data.length)]);
    }

    let changed = true;
    while (changed) {
      changed = false;

      // Assign data points to the nearest centroid
      const clusters = new Array(k).fill(null).map(() => []);
      for (const point of data) {
        let minDistance = Infinity;
        let closestCentroidIndex = -1;
        for (let j = 0; j < k; j++) {
          const distance = euclideanDistance(point, centroids[j]);
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroidIndex = j;
          }
        }
        clusters[closestCentroidIndex].push(point);
      }

      // Recompute centroids based on the assigned data points
      const newCentroids = [];
      for (let i = 0; i < k; i++) {
        const cluster = clusters[i];
        if (cluster.length === 0) {
          // Handle empty clusters (re-initialize centroid)
          newCentroids.push(data[Math.floor(Math.random() * data.length)]);
        } else {
          const newCentroid = {
            KD: 0,
            SA: 0,
            SAK: 0,
            SKEL: 0,
          };
          for (const point of cluster) {
            newCentroid.KD += point.KD;
            newCentroid.SA += point.SA;
            newCentroid.SAK += point.SAK;
            newCentroid.SKEL += point.SKEL;
          }
          newCentroid.KD /= cluster.length;
          newCentroid.SA /= cluster.length;
          newCentroid.SAK /= cluster.length;
          newCentroid.SKEL /= cluster.length;
          newCentroids.push(newCentroid);
        }
      }

      // Check if centroids have changed
      changed = false;
      for (let i = 0; i < k; i++) {
        if (
          euclideanDistance(centroids[i], newCentroids[i]) > 0.001
        ) {
          changed = true;
          break;
        }
      }

      centroids.length = 0;
      centroids.push(...newCentroids);
    }

    return { centroids, clusters };
  }


  console.log(data)

  function euclideanDistance(point1, point2) {
    let distance = 0;
    for (const key in point1) {
      if (key !== 'C1' && key !== 'C2' && key !== 'C3') {
        distance += Math.pow(point1[key] - point2[key], 2);
      }
    }
    return Math.sqrt(distance);
  }


  const k = 3; // Number of clusters
  const result = kMeans(data, k);


  console.log(data)
  console.log('Centroids:', result.centroids);
  console.log('Clusters:', result.clusters);


};

export default ClusterData;
