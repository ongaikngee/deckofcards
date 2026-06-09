import React, { useEffect, useRef, useState } from 'react';

function StudPokerLineChart({ chartData }) {
  const chartRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Load Google Charts once
  useEffect(() => {
    google.charts.load('current', {
      packages: ['corechart'],
    });

    google.charts.setOnLoadCallback(() => {
      setLoaded(true);
    });
  }, []);

  // Redraw whenever data changes
  useEffect(() => {
    if (!loaded || !chartRef.current) return;

    const data = google.visualization.arrayToDataTable(chartData);

    const options = {
      title: 'Win/Loss Performance',
      // curveType: 'function',
      legend: { position: 'bottom' },
    };

    const chart = new google.visualization.LineChart(
      chartRef.current
    );

    chart.draw(data, options);
  }, [loaded, chartData]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
}

export default StudPokerLineChart;