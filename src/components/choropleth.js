import React, { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { ChoroplethController, GeoFeature, ProjectionScale, ColorScale } from "chartjs-chart-geo";
import { feature } from "topojson-client";
import "chartjs-chart-geo";
import { EEC, ESE, LAC, MENA, NAC, Oceania, SA, SSA, WNS } from "./countries";
import { answerStore, gridStore } from "../redux/store";

Chart.register(...registerables, ChoroplethController, GeoFeature, ProjectionScale, ColorScale);

function ChoroplethMap() {
  const chartRef = useRef(null);
  const [map, setMap] = useState(false);

  // const [chart, setChart] = useState(null);

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
              xy: {
                type: 'projection',
                projection: 'equalEarth'
              }
            },
            color: {
              type: 'color',
              quantize: 5,
              legend: {
                position: 'bottom-right',
                align: 'bottom'
              }
            }
          },
        });

        const unsubscribe = answerStore.subscribe(() => {
          const state = answerStore.getState();
          if (chart) {
            for (let obj in state) {
              if (obj === "NAC") {
                for (let i = 0; i < NAC.length; i++) {
                  let index = chart.data.labels.indexOf(NAC[i]);
                  let option = state["NAC"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "WNS") {
                for (let i = 0; i < WNS.length; i++) {
                  let index = chart.data.labels.indexOf(WNS[i]);
                  let option = state["WNS"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "Oceania") {
                for (let i = 0; i < Oceania.length; i++) {
                  let index = chart.data.labels.indexOf(Oceania[i]);
                  let option = state["Oceania"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "SSA") {
                for (let i = 0; i < SSA.length; i++) {
                  let index = chart.data.labels.indexOf(SSA[i]);
                  let option = state["SSA"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "LAC") {
                for (let i = 0; i < LAC.length; i++) {
                  let index = chart.data.labels.indexOf(LAC[i]);
                  let option = state["LAC"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "SA") {
                for (let i = 0; i < SA.length; i++) {
                  let index = chart.data.labels.indexOf(SA[i]);
                  let option = state["SA"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "ESE") {
                for (let i = 0; i < ESE.length; i++) {
                  let index = chart.data.labels.indexOf(ESE[i]);
                  let option = state["ESE"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "MENA") {
                for (let i = 0; i < MENA.length; i++) {
                  let index = chart.data.labels.indexOf(MENA[i]);
                  let option = state["MENA"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
              } else if (obj === "EEC") {
                for (let i = 0; i < EEC.length; i++) {
                  let index = chart.data.labels.indexOf(EEC[i]);
                  let option = state["EEC"];
                  if (index !== -1) {
                    if (option == "Insignificant") {
                      chart.data.datasets[0].data[index].value = 5;
                    } else if (option == "Marginal") {
                      chart.data.datasets[0].data[index].value = 10;
                    } else if (option == "Significant") {
                      chart.data.datasets[0].data[index].value = 15;
                    } else if (option == "Dominant") {
                      chart.data.datasets[0].data[index].value = 20;
                    }
                  }
                }
                chart.update();
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
