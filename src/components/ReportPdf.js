import React from 'react';
import { Page, View, Document, StyleSheet, PDFViewer, Image, Text } from '@react-pdf/renderer';

const ReportPdf = () => {
  const arr = JSON.parse(localStorage.getItem("Images")) || [];
  const reportData = JSON.parse(localStorage.getItem("rp"))
  const styles = StyleSheet.create({
    page: {
      margin: 5,
    },
    heading: {
        fontSize: 19,
        marginTop: 5,
        marginLeft: 57,
        color: "#595b5f",
        margin: "2%"
    },
    subtitle: {
        fontWeight: 300,
        fontSize: 11,
        marginLeft: "3%",
        color: "#6d7784"
    },
    form: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      color: "#595b5f"
    },
    label: {
      fontSize: 10,
      fontWeight: 700,
      marginTop: 10,
      marginLeft: 5,
      color: "#595b5f"
    },
    textAreas: {
      marginHorizontal: 8,
      marginVertical: 4,
      borderStyle: "dashed",
      borderColor: "grey",
      width: "85%",
      borderWidth: 1,
      padding: 10,
      height: "auto" 
    },
    textAreasContext: {
      borderStyle: "dashed",
      borderColor: "grey",
      width: "85%",
      borderWidth: 1,
      padding: 10,
      marginLeft: 12
    },
    textAreasAnaylysis: {
      height: 600,
      marginHorizontal: 4,
      marginVertical: 4,
      width: "100%",
      padding: 20,
      display: "flex"
    },
    analysisView: {
      width: 390,
      height: 170,
      padding: 5,
      borderStyle: "solid",
      borderColor: "black",
      borderWidth: 1,
      margin: 5,
    },
    analysisText: {
      fontSize : 10,
    },
    pageNum: {
      position: "absolute",
      bottom: 10,
      left: 10,
      fontSize: 8,
      color: "#595b5f"
    },
    text: {
      fontSize: 10,
      color: "#595b5f"
    },
    updateInfo: {
      position: "absolute",
      bottom: 10,
      color: "#595b5f",
      right: 30,
      fontSize: 8,
    },
    bubble: {
      display : "flex",
      height: "80%",
      width: "80%",
      margin: "auto",
      marginTop: "5%"
    },
    mapSize :{
      width : "560em",
      height : "800em"
    },
    textSize : {
      fontSize: 10
    },
    contextTwo :{
      marginLeft: "65px",
      borderStyle: "dashed",
      borderColor: "grey",
      width: "82%",
      borderWidth: 1,
      padding: 10,
      marginVertical: 20
    },
    analysisLabel :{
      display: "flex",
      flexDirection: "column",
      marginLeft: "5",
      justifyContent: "space-around",
      height: "500px"
    }
  });

  return (
    <div>
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
          <View style={styles.form}>
          <Text style={styles.label}>
              Report  {"\n"}Summary:
            </Text>
            <View  style={styles.textAreas}>
                <Text style={styles.textSize}>
                  {reportData?.reportSummary}
                </Text>
            </View>
          </View>
          <View style={styles.form} >
            <Text style={styles.label}>
                Context :
            </Text>
            <View  style={styles.textAreasContext}>
                <Text style={styles.text} >
                  {reportData? reportData["Research framework and methodologies"] :"" }
                </Text>
            </View>
          </View>
          <View  style={styles.contextTwo}>
                <Text style={styles.text} >
                  {reportData? reportData["Case-specific notes"] :""}
                </Text>
            </View>
            <View style={styles.form} >
            <Text style={styles.label}>
                Analysis :
            </Text>
            <View style={styles.analysisLabel}> 
            <Text style={styles.label}>
              Performance Analysis
            </Text>
            <Text style={styles.label}>
              Confidence Analysis
            </Text>
            <Text style={styles.label}>
              Opinion :
            </Text>
            </View>
            <View  style={styles.textAreasAnaylysis}>
                <View style={styles.analysisView}>
                  <Text style={styles.analysisText}>
                    {reportData? reportData["Performance Analysis"]: ""}
                  </Text>
                </View>
                <View style={styles.analysisView}>
                  <Text style={styles.analysisText}>
                    {reportData? reportData["Confidence Analysis"]:""}
                  </Text>
                </View>
                <View style={styles.analysisView}>
                  <Text style={styles.analysisText}>
                    {reportData? reportData["Opinion"]:""}
                  </Text>
                </View>
               
            </View>
          </View>
          <View> 
          <Text style={styles.pageNum}>Page: 1 of 3</Text>
            
          </View>
          <View style={styles.bubble}>
          <View >
            <Text style={styles.heading}>
              Global Company LLC
            </Text>
            <Text style={styles.subtitle}>
              Time frame of analysis: 2024-2029
            </Text>
          </View>
                 {arr.length > 0 && <Image src={{ uri: arr[3], method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />}
              {arr.length > 0 && <Image src={{ uri: arr[0], method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />}
                </View>
          <Text style={styles.pageNum}>Page: 2 of 3</Text>
            </Page>
            <Page>
            <View style={styles.mapSize}>
              {arr.length > 0 && <Image src={{ uri: arr[1], method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />}
              {arr.length > 0 && <Image src={{ uri: arr[2], method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />}
            <View style={styles.form}>
          <Text style={styles.label}>
              Conclusion:
            </Text>
            <View  style={styles.textAreas}>
                <Text style={styles.textSize}>
                  {reportData?.reportSummary}
                </Text>
            </View>
          </View>
          <View style={styles.form}>
          <Text style={styles.label}>
              References:
            </Text>
            <View  style={styles.textAreas}>
                <Text style={styles.textSize}>
                  {reportData?.reportSummary}
                </Text>
            </View>
          </View>
            </View>
            <Text style={styles.pageNum}>Page: 3 of 3</Text>

            </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default ReportPdf;
