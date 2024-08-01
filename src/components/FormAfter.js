import React, { useEffect, useRef, useState } from 'react'
import BubbleChart from './BubbleChart'
import { Bubble } from 'react-chartjs-2'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {Button, Typography } from '@mui/material'
import {styled} from '@mui/system'
import './formAfter.css'
import { sendReportData } from '../api'
import { answerStore, mapStore, scoreStore } from '../redux/store'
import { Chart, registerables } from 'chart.js'
import { ChoroplethChart, ChoroplethController, ColorScale, GeoFeature, ProjectionScale } from 'chartjs-chart-geo'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { EEC, ESE, LAC, MENA, NAC, Oceania, SA, SSA, WNS } from "./countries";
import { feature } from "topojson-client"; 
import { countriesArr } from './maplogic'

const FormAfter = () => {
    const [reportData, setreportData] = useState({})
    const [mapData, setmapData] = useState({})
    const [contries, setcontries] = useState([])
    const [scoreData, setscoreData] = useState(null)
    const [arrFV, setarrFV] = useState([])
    const [arrFV2, setarrFV2] = useState([])
    const [arrFV3, setarrFV3] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const reff = useRef()
    const reff2 = useRef()
    const reff3 = useRef()
    const pdfRef = useRef()
    const lastSectionRef = useRef()

   let [searchParamss] = useSearchParams()
   Chart.register(
    ...registerables,
    ChoroplethController,
    GeoFeature,
    ProjectionScale,
    ColorScale 
  );
  const redirect = useNavigate()
// console.log(mapData["Issuer's cost breakdown by geography"])
    useEffect(() => {
      const unsubscribeMap = mapStore.subscribe(() => {
        setmapData(mapStore.getState());
        console.log(mapStore.getState());
      });
      setmapData(mapStore.getState());
      const unsubscribeScore = scoreStore.subscribe(() => {
        setscoreData(scoreStore.getState());
        console.log(scoreStore.getState());
      });
      setscoreData(scoreStore.getState());
      return () => {
        unsubscribeMap();
        unsubscribeScore();
      };
    }, []);
    console.log("mapData",mapData)
    function MapValueLogic (convertedarr, mapDataObject) {
       const updatedArr = JSON.parse(JSON.stringify(convertedarr))
      for (const key in mapDataObject) {
        if(key == "Oceania"){
          for (let i = 0; i < Oceania.length; i++) {
            let index = countriesArr.indexOf(Oceania[i])
            let option = mapDataObject["Oceania"]
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "NAC"){
          for (let i = 0; i < NAC.length; i++) {
            let index = countriesArr.indexOf(NAC[i])
            console.log(index)
            let option = mapDataObject["NAC"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "EEC"){
          for (let i = 0; i < EEC.length; i++) {
            let index = countriesArr.indexOf(EEC[i])
            console.log(index)
            let option = mapDataObject["EEC"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "ESE"){
          for (let i = 0; i < ESE.length; i++) {
            let index = countriesArr.indexOf(ESE[i])
            console.log(index)
            let option = mapDataObject["ESE"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "LAC"){
          for (let i = 0; i < LAC.length; i++) {
            let index = countriesArr.indexOf(LAC[i])
            console.log(index)
            let option = mapDataObject["LAC"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "MENA"){
          for (let i = 0; i < MENA.length; i++) {
            let index = countriesArr.indexOf(MENA[i])
            console.log(index)
            let option = mapDataObject["MENA"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "SA"){
          for (let i = 0; i < SA.length; i++) {
            let index = countriesArr.indexOf(SA[i])
            console.log(index)
            let option = mapDataObject["SA"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "SSA"){
          for (let i = 0; i < SSA.length; i++) {
            let index = countriesArr.indexOf(SSA[i])
            console.log(index)
            let option = mapDataObject["SSA"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }else if(key == "WNS"){
          for (let i = 0; i < WNS.length; i++) {
            let index = countriesArr.indexOf(WNS[i])
            console.log(index)
            let option = mapDataObject["WNS"]
            console.log(option)
            if(index !== -1){
              if (option == "Insignificant") {
                updatedArr[index].value = 5;
              } else if (option == "Marginal") {
                updatedArr[index].value = 10;
              } else if (option == "Significant") {
                updatedArr[index].value = 15;
              } else if (option == "Dominant") {
                updatedArr[index].value = 20;
              } else {
                updatedArr[index].value = 10;
              }
            }
          }
        }
      }
      return updatedArr
    }
    useEffect(()=>{
      async function fetchData() {
        const response = await fetch("https://unpkg.com/world-atlas/countries-50m.json");
        const data = await response.json();
        const countries = feature(data, data.objects.countries).features;
        setcontries(countries);
        console.log("countries",countries);
        const convertedarr = countries.map((e) => { return { feature: e, value: 0 } });
        const arrToUse = MapValueLogic(convertedarr, mapData[`Issuer's cost breakdown by geography`]);
        const arrToUse2 = MapValueLogic(convertedarr, mapData[`Issuer's revenue breakdown by geography`]);
        const arrToUse3 = MapValueLogic(convertedarr, mapData[`What is the issuer's controlling jurisdiction?`]);

        setarrFV(arrToUse)
        setarrFV2(arrToUse2)
        setarrFV3(arrToUse3)
        
  }
      fetchData()
    }, 
    [mapData])
    useEffect(() => {
      console.log("arrFV:",arrFV)
      const ctx = reff.current.getContext("2d")
      const ctx2 = reff2.current.getContext("2d")
      const ctx3 = reff3.current.getContext("2d")
      const chart = new Chart(ctx, {
        type: "choropleth",
        data: {
          labels: contries.map((d) => d.properties.name),
          datasets: [
            {
              label: "Countries",
              data: arrFV.map((d) => ({
                feature: d.feature,
                value: d.value,
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
          color: {
            type: "color",
            quantize: 5,
            legend: {
              position: "bottom-right",
              align: "bottom",
            },
          },
        },
      })
      const char2 = new Chart(ctx2,{
        type: "choropleth",
        data: {
          labels: contries.map((d) => d.properties.name),
          datasets: [
            {
              label: "Countries",
              data: arrFV2.map((d) => ({
                feature: d.feature,
                value: d.value,
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
          color: {
            type: "color",
            quantize: 5,
            legend: {
              position: "bottom-right",
              align: "bottom",
            },
          },
        },
      })
      const char3 = new Chart(ctx3,{
        type: "choropleth",
        data: {
          labels: contries.map((d) => d.properties.name),
          datasets: [
            {
              label: "Countries",
              data: arrFV3.map((d) => ({
                feature: d.feature,
                value: d.value,
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
          color: {
            type: "color",
            quantize: 5,
            legend: {
              position: "bottom-right",
              align: "bottom",
            },
          },
        },
      })
      return ()=>{
        chart.destroy()
        char2.destroy()
        char3.destroy()
      }
    }, [arrFV, arrFV2, arrFV3])
    
    
   
    const CustomHeading = styled(Typography)({
        fontSize : "35px",
        padding: "12px 15px",
        marginTop: "10px",
        marginLeft : "57px",
        color: "#595b5f"
    })
    const CustomMapHeading = styled(Typography)({
      fontSize : "25px",
      padding: "12px",
      margin: "20px",
      textAlign: "center",
      marginLeft: "30%",
      width: "50%",
      color: "#595b5f"
  })
    const CustomLabel = styled(Typography)({
        fontSize : "25px",
        padding: "20px",
        fontWeight: 700,
        marginTop: "10px",
        marginLeft : "57px",
        color: "#595b5f"
    })
    const CustomLabelMap = styled(Typography)({
      fontSize : "30px",
      padding: "20px",
      fontWeight: 700,
      marginTop: "10px",
      textAlign: "center",
      color: "#595b5f"
  })
    const data = {
        datasets: [
          {
            label: "E1",
            data: [{x : scoreData?.e_perf, y: scoreData?.e_conf, r: Math.floor(scoreData?.e_weight) *2}],
            backgroundColor : 'rgba(54,162,235,0.6)'
          },
          {
            label: "G1",
            data: [{x : scoreData?.g_perf, y: scoreData?.g_conf, r: Math.floor(scoreData?.g_weight) *2}],
            backgroundColor : 'rgba(75, 192, 192, 0.6)'
          }
          ,
          {
            label: "S1",
            data: [{x : scoreData?.s_perf, y: scoreData?.s_conf, r: Math.floor(scoreData?.s_weight) *2}],
            backgroundColor : 'rgba(255, 159, 64, 0.6)'
          },
          {
            label: "overall",
            data: [{x : scoreData?.perf, y: scoreData?.conf, r: 10}],
            backgroundColor : 'rgba(201, 203, 207, 0.6)'
          }
          
        ],
          backgroundColor: "gradient",
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
      };   
     const options = {
        maintainAspectRatio: false,
        scales: {
          x : {
            min: 0,
            max: 12,
            title : {
              display: true,
              text: "perfromance"
            },
            ticks: {
              stepSize : 4,
              callback: (value) => {
                if (value == 0) return `${value} \n \n Lagging`;
                if (value >= 0 && value <=4) return `${value}`;
                if (value >= 4 && value <=12) return `${value}`;
                if (value == 12) return 'Authentic';
                if (value == 12) return 'Authentic';
                return 'Authentic';
              },
            }
          },
          y  : {
            min: 0,
            max: 12,
            title : {
              display: true,
              text: "confidence"
            },
            ticks: {
              stepSize : 4,
              callback: (value) => {
                if (value >= 0 && value <=4) return `${value}`;
                if (value >= 4 && value <12) return `${value}`;
                if (value == 12) return `${value}`;
                return 'Confidence';
              },
            }
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
       function handleChange(e){
        setreportData({...reportData, [e.target.name]: e.target.value})
      }
      async function downloadPDF (){
        const pdfREF = pdfRef.current;
        const lastSectionReff  = lastSectionRef.current
        
          const canvass = await html2canvas(pdfREF)
          const imgData = canvass.toDataURL('image/png');
          const pdf = new jsPDF('p',"px","a4",true);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvass.width;
          const imgHeight = canvass.height;
          const ratio = Math.min(0.27);
          const secondratio = Math.min(0.27);
          const imgX = 9;
          const imgY = 9;
          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          const secondImgData = await html2canvas(lastSectionReff)
          const secondImage = secondImgData.toDataURL("image/png")
          pdf.addPage("a4", "p")
          pdf.addImage(secondImage, "PNG", imgX, imgY, secondImgData.width * secondratio, secondImgData.height*secondratio)
          pdf.save("report.pdf")
    }
    async function handleTheSubmit(e){
       setisLoading(true)
       const bodyOfRequest = {reportData: {...reportData}, qid :searchParamss.get("qid")}
       await sendReportData(bodyOfRequest, localStorage.getItem("jwt"))
       await downloadPDF() 
       setisLoading(false)
       redirect("/home")
    }
  return (
    <div ref={pdfRef}>
        <CustomHeading>  Global Company LLC </CustomHeading>
        <Typography
        variant="h4"
        gutterBottom
        style={{
          fontWeight: 300,
          fontSize: "17px",
          marginBottom: "20px",
          marginLeft : "77px",
          color: "#6d7784"
        }}
       >
        Time frame of analysis: 2024-2029
       </Typography>
        <div className="rSummary">
        <CustomLabel> Report <br /> Summary: </CustomLabel>
        <textarea onChange={handleChange}  name='reportSummary' className='textAreaClass' rows="4" cols="124"> </textarea>
        </div>
        <div className="rSummary">
             <CustomLabel> Context: </CustomLabel>
        <div className="contextDiv">
             <textarea onChange={handleChange} name='Research framework and methodologies' placeholder='Research framework and methodologies' className='textAreaClass new' rows="4" cols="124"></textarea>

             <textarea onChange={handleChange} name='Case-specific notes' placeholder='Case-specific notes' className='textAreaClass new' rows="4" cols="124"></textarea>
        </div>
        </div>

        <div  className="rSummary">
        <CustomLabel>Analysis  </CustomLabel>
        <div className='analysisDiv' id='AnalysisContinued' >   
            <textarea onChange={handleChange} type="text" name='Performance Analysis'  className='analysistextArea' rows={5} cols={55} placeholder="Performance Analysis" /><br />
            <textarea onChange={handleChange} type="text" name='Confidence Analysis' className='analysistextArea' rows={5} cols={55} placeholder="Confidence Analysis" /><br />
            <textarea onChange={handleChange} type="text" name='Opinion' className='analysistextArea' rows={5} cols={55} placeholder="Opinion" />
        </div>
        <div style={{ marginTop: '10px' }}>

    </div>
          <div  style={{
            width: "35%",
            height: "60vh",
            zIndex: 1,
            position: "absolute",
            top: "150%",
            left: "58%",
            transform: "translate(-50%, -90%)", 
            padding: "20px", 
            boxSizing: "border-box" 
           }}>
             <Bubble data={data} options={options} />    
          </div>
        </div>
        <div className="maps">   
              <div className='map-child' >
                <CustomMapHeading>{Object.keys(mapData)[0]}</CustomMapHeading>
               <canvas className='map-child-canvas' ref={reff}/>  
             </div>
        <div ref={lastSectionRef}>
             <div  className='map-child'  >
             <CustomMapHeading>{Object.keys(mapData)[1]}</CustomMapHeading>
             <canvas  className='map-child-canvas' ref={reff2}/> 
             </div>
             <div  className='map-child' >
             <CustomMapHeading>{Object.keys(mapData)[2]}</CustomMapHeading>
             <canvas  className='map-child-canvas'  ref={reff3}/> 
             </div>
          
        <div  className="rSummary">
        <CustomLabel>Conclusion: </CustomLabel>
        <textarea onChange={handleChange} className='textAreaClass' name='conclusion' rows="6" cols="124"> </textarea>
        </div>
        <div className="rSummary">
        <CustomLabel>References: </CustomLabel>
        <textarea onChange={handleChange} name="refrences" className='textAreaClass' rows="10" cols="124"> </textarea>
        </div>
        </div>
      </div>
        <div className="buttonsDiv">
        <Button
        variant="contained"
        onClick={handleTheSubmit}
        type='submit'
        style={{
          backgroundColor: "#449082",
          color: "white",
          width: "200px",
          height: "40px",
          fontSize: "16px",
          display: "block",
          margin: "10px 20px",
          border: "1px solid #449082",
          boxShadow: "none",
        }}
        >
        Submit Report Data {isLoading && <span className='loader'></span>}
        </Button>
       </div>
    </div>
  )
}

export default FormAfter