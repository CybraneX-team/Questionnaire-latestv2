import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { scoreStore } from "../redux/store";
import { Dataset } from "@mui/icons-material";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
const RadarChart = () => {
  const [dataSet, setDataSet] = useState([]);

  useEffect(() => {
    let state = scoreStore.getState();
    setDataSet(state);
  }, []);

  const data = {
    labels: ["E1", "E2", "E3", "G1", "G2", "G3", "S1", "S2", "S3"],
    datasets: [
      {
        label: "Confidence",
        data: [
          dataSet.e1_conf,
          dataSet.e2_conf,
          dataSet.e3_conf,
          dataSet.g1_conf,
          dataSet.g2_conf,
          dataSet.g3_conf,
          dataSet.s1_conf,
          dataSet.s2_conf,
          dataSet.s3_conf,
        ],
        backgroundColor: "#FEECD2",
        borderColor: "#FFBC58",
        pointBackgroundColor: "#FFBC58",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FFBC58",
      },
      {
        label: "Performance",
        data: [
          dataSet.e1_perf,
          dataSet.e2_perf,
          dataSet.e3_perf,
          dataSet.g1_perf,
          dataSet.g2_perf,
          dataSet.g3_perf,
          dataSet.s1_perf,
          dataSet.s2_perf,
          dataSet.s3_perf,
        ],
        backgroundColor: "#008080",
        borderColor: "#D99E72",
        pointBackgroundColor: "#FFBC58",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FFBC58",
      },
      {
        label: "Weight",
        data: [
          dataSet.e1_weight,
          dataSet.e2_weight,
          dataSet.e3_weight,
          dataSet.g1_weight,
          dataSet.g2_weight,
          dataSet.g3_weight,
          dataSet.s1_weight,
          dataSet.s2_weight,
          dataSet.s3_weight,
        ],
        backgroundColor: "#93C572",
        borderColor: "#E7B08C",
        pointBackgroundColor: "#FFBC58",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FFBC58",
      },
    ],
  };
  const options = {
    scale: {
      ticks: { beginAtZero: true },
    },
  };
  return dataSet["conf"] ? <Radar data={data} options={options} /> : <></>;
};
export default RadarChart;
