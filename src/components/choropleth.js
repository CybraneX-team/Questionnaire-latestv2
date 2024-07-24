import React, { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { ChoroplethController, GeoFeature } from "chartjs-chart-geo";
import { feature } from "topojson-client";
import "chartjs-chart-geo";
import { NAC } from "./countries";
import { answerStore } from "../redux/store";

Chart.register(...registerables, ChoroplethController, GeoFeature);

function ChoroplethMap() {
  const chartRef = useRef(null);
  // const [chart, setChart] = useState(null);

  useEffect(() => {}, []);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    fetch("https://unpkg.com/world-atlas/countries-50m.json")
      .then((response) => response.json())
      .then((data) => {
        const countries = feature(data, data.objects.countries).features;

        const chart = new Chart(ctx, {
          type: "choropleth",
          data: {
            labels: countries.map((d) => d.properties.name),
            datasets: [
              {
                label: "Countries",
                data: countries.map((d) => ({
                  feature: d,
                  value: 0,
                })),
              },
            ],
          },
          options: {
            showOutline: true,
            showGraticule: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              projection: {
                axis: "x",
                projection: "equalEarth",
              },
            },
          },
        });

        const unsubscribe = answerStore.subscribe(() => {
          const state = answerStore.getState();
          if (chart) {
            let idx = chart.data.labels.indexOf("India");
            chart.data.datasets[0].data[idx].value = 5;
            chart.update();
            for (let obj in state) {
              if (obj === "NAC") {
                for (let i = 0; i < 3; i++) {
                  console.log("Country list");
                  console.log(NAC[i]);
                  let index = chart.data.labels.indexOf(NAC[i]);
                  console.log(index);

                  if (index !== -1) {
                    chart.data.datasets[0].data[index].value = 5;
                    chart.update();
                  }
                }
              }
            }
          }
        });

        //  setChart(chart);
        return () => {
          chart.destroy();
        };
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return <canvas ref={chartRef} />;
}

export default ChoroplethMap;
