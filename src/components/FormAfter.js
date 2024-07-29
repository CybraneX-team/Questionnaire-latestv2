import React, { useEffect, useRef, useState } from 'react'
import BubbleChart from './BubbleChart'
import { Bubble } from 'react-chartjs-2'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {Button, TextField, Typography } from '@mui/material'
import {styled} from '@mui/system'
import './formAfter.css'
import { sendReportData } from '../api'
import { mapStore, scoreStore } from '../redux/store'
import { Chart } from 'chart.js'
import { ChoroplethChart, GeoFeature } from 'chartjs-chart-geo'

const FormAfter = () => {
    const redirect = useNavigate()
    const [reportData, setreportData] = useState({})
    const [mapData, setmapData] = useState(null)
    const [scoreData, setscoreData] = useState(null)
    const ref = useRef()
    const ref2 = useRef()
   let [searchParamss] = useSearchParams()

    Chart.register(ChoroplethChart, GeoFeature)

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
      console.log("scoreData", scoreData)
      console.log("mapData", mapData)
    useEffect(() => {
      if (!ref.current || !mapData?.length) {
        return;
      }
      const ctx = ref.current.getContext("2d")
      const chart = new Chart(ctx, {
        type: "choropleth",
        data: {
          labels: mapData[0].data.labels.map(e=> e),
          datasets: [
            {
               label: "Countries",
               data: mapData[0].data.datasets[0].data.map((e)=>({
                feature: e.feature,
                value: e.value,
               }))
            }
          ]
        },
        options : {
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
        }
      })

    return () => {
      chart.destroy();
    };
    }, [mapData])
    useEffect(() => {
      if (!ref2.current || !mapData?.length) {
        return;
      }
      const ctx = ref2.current.getContext("2d")
      const chart = new Chart(ctx, {
        type: "choropleth",
        data: {
          labels: mapData[1].data.labels.map(e=> e),
          datasets: [
            {
               label: "Countries",
               data: mapData[1].data.datasets[0].data.map((e)=>({
                feature: e.feature,
                value: e.value,
               }))
            }
          ]
        },
        options : {
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
        }
      })

    return () => {
      chart.destroy();
    };
    }, [mapData])
    const CustomHeading = styled(Typography)({
        fontSize : "35px",
        padding: "12px 15px",
        marginTop: "10px",
        marginLeft : "57px",
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
            data: [{x : scoreData?.e_perf, y: scoreData?.e_conf, radius: scoreData?.e_weight *2}],
            backgroundColor : 'rgba(54,162,235,0.6)'
          },
          {
            label: "G1",
            data: [{x : scoreData?.g_perf, y: scoreData?.g_conf, radius: scoreData?.g_weight *2}],
            backgroundColor : 'rgba(75, 192, 192, 0.6)'
          }
          ,
          {
            label: "S1",
            data: [{x : scoreData?.e_perf, y: scoreData?.e_conf, radius: scoreData?.s_weight *2}],
            backgroundColor : '255, 159, 64, 0.6'
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
      async function handleTheSubmit(e){
        e.preventDefault()
        if(localStorage.getItem("reportData")){
          localStorage.removeItem("reportData")
        }
         localStorage.setItem("reportData", JSON.stringify(reportData))
         const bodyOfRequest = {...reportData, mapData: mapData, qid :searchParamss.get("qid")}
         await sendReportData(bodyOfRequest, localStorage.getItem("jwt"))
        //  redirect("/reportpdf")
        window.open('/reportpdf', '_blank')
        window.location.href = "/home"
      }
  return (
    <div>
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
       <form onSubmit={handleTheSubmit} >
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
            width: "25%",
            height: "50vh",
            zIndex: 1,
            position: "absolute",
            top: "140%",
            left: "55%",
            transform: "translate(-50%, -90%)", 
            maxWidth: "400px", 
            minWidth: "200px", 
            padding: "20px", 
            boxSizing: "border-box" 
           }}>
             <Bubble data={data} options={options} />    
          </div>
        </div>
        <div className="maps">
          {
          <>
           <CustomLabelMap>{mapData? mapData[0]?.id: ""}</CustomLabelMap>   
           <div className='flex' style={{height: "800px", width: "800px"}} >
             <canvas style={{height: "800px", width: "800px"}} className='mapchart' ref={ref}/>  
           </div>
           <CustomLabelMap>{mapData? mapData[1]?.id: ""}</CustomLabelMap>   
           <div className='flex' style={{height: "800px", width: "800px"}} >
             <canvas style={{height: "800px", width: "800px"}} className='mapchart' ref={ref2}/>  
           </div>
           </>
          }
        </div>
        <div className="rSummary">
        <CustomLabel>Conclusion: </CustomLabel>
        <textarea onChange={handleChange} className='textAreaClass' name='conclusion' rows="6" cols="124"> </textarea>
        </div>
        <div className="rSummary">
        <CustomLabel>References: </CustomLabel>
        <textarea onChange={handleChange} name="refrences" className='textAreaClass' rows="10" cols="124"> </textarea>
        </div>
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
        Submit Report Data
        </Button>
       </form>
    </div>
  )
}

export default FormAfter