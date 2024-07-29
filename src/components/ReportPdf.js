import React ,{useEffect, useRef, useState} from 'react'
import './formAfter.css'
import { Bubble } from 'react-chartjs-2'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import './formAfter.css'
import { Chart as ChartJS, Title, Tooltip, Legend, BubbleController, LinearScale, CategoryScale } from 'chart.js';

// Register components needed for Chart.js
ChartJS.register(Title, Tooltip, Legend, BubbleController, LinearScale, CategoryScale);

const ReportPdf = () => {
  const [chartDataUrl, setChartDataUrl] = useState("");
  const chartRef = useRef(null);
  const [chartReady, setChartReady] = useState(false);

  const generateChartImage = () => {
    if (chartRef.current) {
      const chart = chartRef.current.chartInstance || chartRef.current;
      if (chart && chart.toBase64Image) {
        setChartDataUrl(chart.toBase64Image());
        setChartReady(true);
      }
    }
  };

  useEffect(() => {
    generateChartImage();
  }, []);
  
  
  
  const styles = StyleSheet.create({
    page: {
      margin: "5px"
    },
    heading: {
        fontSize : "19px",
        marginTop: "5px",
        marginLeft : "57px",
        color: "#595b5f",
        margin: "2%"
    },
    subtitle:{
        fontWeight: 300,
        fontSize: "11px",
        marginLeft: "3%",
        color: "#6d7784"
    },
    form : {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      margin: 10,
      color: "#595b5f"
    },
    label: {
      fontSize : "15px",
      fontWeight: 700,
      marginTop: "10px",
      marginLeft : "8px",
      color: "#595b5f"
    },
    textAreas: {
      marginHorizontal: 8,
      marginVertical: 4,
      borderStyle: "dashed",
      borderColor: "grey",
      width: "80%",
      borderWidth: 1,
      padding: 20,
    },
    textAreasContext: {
      marginHorizontal: 8,
      marginVertical: 4,
      borderStyle: "dashed",
      borderColor: "grey",
      width: "74%",
      borderWidth: 1,
      padding: 20,
      marginLeft: 98
    },
    textAreasAnaylysis:{
      height: 400,
      marginHorizontal: 8,
      marginVertical: 4,
      borderStyle: "dashed",
      borderColor: "grey",
      width: "80%",
      borderWidth: 1,
      padding: 20,
    },
    analysisView:{
      width: 250 ,
      height: 150 ,
      borderStyle: "solid",
      borderColor: "black",
      borderWidth: 1,
      margin: 5,
    },
    analysisText: {
      padding: 5
    },
    pageNum: {
      position: "absolute",
      bottom: 10,
      left: 30,
      fontSize: 8,
      color: "#595b5f"
    },
    text: {
      fontSize: 8,
      marginBottom: 5,
      color: "#595b5f"
    },
    updateInfo: {
      position: "absolute",
      bottom: 10,
      color: "#595b5f",
      right: 30,
      fontSize: 8,
    }
  });
  const data = {
    datasets: [
      {
        label: "E1",
        data: [{ x: 2, y: 7, r: 15 }],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "E2",
        data: [{ x: 2, y: 4, r: 15 }],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "E3",
        data: [{ x: 5, y: 8, r: 15 }],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "G1",
        data: [{ x: 1, y: 5, r: 15 }],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "G2",
        data: [{ x: 3, y: 3, r: 15 }],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "G3",
        data: [{ x: 10, y: 11, r: 15 }],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "S1",
        data: [{ x: 4, y: 6, r: 15 }],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "S2",
        data: [{ x: 4, y: 7, r: 15 }],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "S3",
        data: [{ x: 5, y: 6, r: 15 }],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Overall",
        data: [{ x: 4, y: 5, r: 25 }],
        backgroundColor: "rgba(201, 203, 207, 0.6)",
      },
      
    ],
      backgroundColor: "gradient",
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Performance",
        },
        ticks: {
          callback: (value) => {
            if (value <= 4) return "Lagging";
            if (value > 4 && value <= 8) return "Advanced";
            return "Authentic";
          },
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Confidence",
        },
        grid: {
          drawOnChartArea: true,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: (${context.raw.x}, ${context.raw.y})`;
          },
        },
      },
    },
  };
    const reportdata = JSON.parse(localStorage.getItem("reportData"))
  return (
    <>
    <div style={{ display: 'none' }}>
        <Bubble ref={chartRef} data={data} options={options} />
      </div>
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View >
            <Text style={styles.heading}>
              Global Company LLC
            </Text>
            <Text style={styles.subtitle}>
              Time frame of analysis: 2024-2029
            </Text>
          </View>
          <View style={styles.form} >
            <Text style={styles.label}>
              Report  {"\n"}Summary:
            </Text>
            <View  style={styles.textAreas}>
                <Text>
                  {reportdata.reportSummary}
                </Text>
            </View>
          </View>
          <View style={styles.form} >
            <Text style={styles.label}>
                Context :
            </Text>
            <View  style={styles.textAreas}>
                <Text>
                  {reportdata["Research framework and methodologies"]}
                </Text>
            </View>
          </View>
          <View  style={styles.textAreasContext}>
                <Text>
                  {reportdata["Case-specific notes"]}
                </Text>
            </View>
            <View style={styles.form} >
            <Text style={styles.label}>
                Analysis :
            </Text>
            <View  style={styles.textAreasAnaylysis}>
                <View style={styles.analysisView}>
                  <Text style={styles.analysisText}>
                    {reportdata["Performance Analysis"]}
                  </Text>
                </View>
                <View style={styles.analysisView}>
                  <Text style={styles.analysisText}>
                    {reportdata["Confidence Analysis"]}
                  </Text>
                </View>
                <View style={styles.analysisView}>
                  <Text style={styles.analysisText}>
                    {reportdata["Opinion"]}
                  </Text>
                </View>
            </View>
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.text}>Last update: 2024-04-01 09:15</Text>
            <Text style={styles.text}>Current print: 2024-05-23 08:00</Text>
          </View>
          <Text style={styles.pageNum}>Page: 1 of 2</Text>
          {/* <View style={styles.section}>
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>Report Summary:</Text>
              <View style={styles.dynamicField}>
                <Text>
                  Blank, user-editable text areas, in future server-generated
                  text may go here. Rich text formatting: bold, italic,
                  underline, and hyperlink.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>Context:</Text>
              <View style={styles.dynamicField}>
                <Text>Research framework and methodologies</Text>
              </View>
              <View style={styles.dynamicField}>
                <Text>Case-specific notes</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>Analysis:</Text>
              <View style={styles.dynamicField}>
                <Text>Performance Analysis</Text>
              </View>
              <View style={styles.dynamicField}>
                <Text>Confidence Analysis</Text>
              </View>
              <View style={[styles.dynamicField, { height: 50 }]}>
                <Text>Opinion</Text>
              </View>
            </View>
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.text}>Last update: 2024-04-01 09:15</Text>
            <Text style={styles.text}>Current print: 2024-05-23 08:00</Text>
          </View> */}
          <Text style={styles.pageNum}>Page: 1 of 2</Text>
        </Page>
        <Page size="A4" style={styles.page}>
          <View >
            <Text style={styles.heading}>
              Global Company LLC
            </Text>
            <Text style={styles.subtitle}>
              Time frame of analysis: 2024-2029
            </Text>
          </View>
          <View style={styles.form} >
            <Text style={styles.label}>
                Conclusion:
            </Text>
            <View  style={styles.textAreas}>
                <Text>
                  {reportdata.conclusion}
                </Text>
            </View>
          </View>
          <View style={styles.form} >
            <Text style={styles.label}>
                refrences:
            </Text>
            <View  style={styles.textAreas}>
                <Text>
                  {reportdata.refrences}
                </Text>
            </View>
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.text}>Last update: 2024-04-01 09:15</Text>
            <Text style={styles.text}>Current print: 2024-05-23 08:00</Text>
          </View>
          <Text style={styles.pageNum}>Page: 2 of 2</Text>
          <View style={styles.textAreasContext}>
              {chartReady && chartDataUrl && <Image src={chartDataUrl} style={{ width: "100%", height: "auto" }} />}
            </View>
        </Page>
      </Document>
    </PDFViewer>
    </>
  )
}

export default ReportPdf
