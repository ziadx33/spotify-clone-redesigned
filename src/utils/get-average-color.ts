export async function getAverageColor(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const context = document.createElement("canvas").getContext("2d");
    if (!context) {
      reject(new Error("Unable to create 2D context"));
      return;
    }

    const img = new Image();
    img.src = src;
    img.crossOrigin = "";

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      context.canvas.width = width;
      context.canvas.height = height;
      context.drawImage(img, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height).data;
      const rgbArray = [];

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        rgbArray.push([r, g, b]);
      }

      const dominantColor = findDominantColor(rgbArray);
      resolve(rgbToHex(dominantColor));
    };

    img.onerror = (error) => {
      reject(new Error(`Failed to load image: ${error}`));
    };
  });
}

function findDominantColor(colors: number[][]): number[] {
  const k = 5; // Number of clusters
  const maxIterations = 100;
  const tolerance = 1; // Convergence tolerance

  // Initialize centroids randomly
  let centroids = colors.sort(() => 0.5 - Math.random()).slice(0, k);

  let clusters: number[][][] = [];
  let previousCentroids: number[][];

  for (let i = 0; i < maxIterations; i++) {
    clusters = Array.from({ length: k }, () => []);

    colors.forEach((color) => {
      const distances = centroids.map((centroid) =>
        Math.sqrt(
          Math.pow(color[0] - centroid[0], 2) +
            Math.pow(color[1] - centroid[1], 2) +
            Math.pow(color[2] - centroid[2], 2),
        ),
      );

      const closestCentroidIndex = distances.indexOf(Math.min(...distances));
      clusters[closestCentroidIndex].push(color);
    });

    previousCentroids = centroids;
    centroids = clusters.map((cluster) => {
      const length = cluster.length;
      const mean = cluster.reduce(
        (acc, color) => {
          acc[0] += color[0];
          acc[1] += color[1];
          acc[2] += color[2];
          return acc;
        },
        [0, 0, 0],
      );

      return length
        ? [
            Math.round(mean[0] / length),
            Math.round(mean[1] / length),
            Math.round(mean[2] / length),
          ]
        : [0, 0, 0];
    });

    // Check for convergence
    const hasConverged = centroids.every((centroid, index) => {
      const prevCentroid = previousCentroids[index];
      return (
        Math.abs(centroid[0] - prevCentroid[0]) <= tolerance &&
        Math.abs(centroid[1] - prevCentroid[1]) <= tolerance &&
        Math.abs(centroid[2] - prevCentroid[2]) <= tolerance
      );
    });

    if (hasConverged) break;
  }

  // Return the largest cluster's centroid as the dominant color
  const largestClusterIndex = clusters.reduce((acc, cluster, index) => {
    return cluster.length > clusters[acc].length ? index : acc;
  }, 0);

  return centroids[largestClusterIndex];
}

function rgbToHex(rgb: number[]): string {
  const [r, g, b] = rgb;
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}
