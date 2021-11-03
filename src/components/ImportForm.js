import React, { useState, useRef } from 'react'
// import CSVReader1 from './CSVReader'
import { FileDrop } from 'react-file-drop'
import Papa from 'papaparse'
import dateFormatter from '../services/dateFormatter'

const CloseButton = ({action}) => {
  return(
    <span onClick={() => action(false)} className="CloseButton">
      <svg className="close-svg" viewBox="-1 -1 4 4" xmlns="http://www.w3.org/2000/svg"><path d='M 0 2 L 1 1 L 0 0 M 2 0 L 1 1 L 2 2'></path></svg>
    </span>
  )
}

const ImportForm = ({importFormOpen, setImportFormOpen}) => {

  const [importData, setImportData] = useState([])
  const [importRuns, setImportRuns] = useState([])
  const [fileDropMessage, setFileDropMessage] = useState('Now drop your file here!')
  const [fileUploaded, setFileUploaded] = useState(false)
  const [importStats, setImportStats] = useState({distance: 0, shoes: []})

  const handleFileDrop = (files, event) => {
    setFileUploaded(true);
    console.log('onDrop!', files, event);
    setFileDropMessage(`${files[0].name} (${(files[0].size/1000).toFixed(0)}KB)`)
    parseFile(files[0])
  }

  // click on file drop stuff
  const fileInputRef = useRef(null);
  const onTargetClick = () => {
    fileInputRef.current.click()
  }
  const onFileInputChange = (event) => {
    const { files } = event.target;
    // do something with your files...
    handleFileDrop(files, event)
    // console.log(files)
  }

  const parseFile = file => {
    Papa.parse(file, {
      header: true,
      complete: results => {
        console.log(results)
        setImportData(results.data)
        let runScrape = []
        let distance = 0;
        let shoes = [];
        results.data.forEach(activity => {
          if (activity['Activity Type'] === 'Run') {
            runScrape.push(activity)
            if (!shoes.includes(activity['Gear'])) {shoes.push(activity['Gear'])}
            distance += (activity['Distance']/1609.344)
          }
        })
        setImportRuns(runScrape)
        setImportStats({distance, shoes})
      }
    });
  }
  // if (formOpen) {
  //distance and elevation are causing that red error
  return(
    <div className={importFormOpen ? "ImportForm" : "ImportForm hidden"}>

      <CloseButton action={setImportFormOpen} />
      <h3>Import your Runs</h3>

      <span className="ServiceName">Strava:</span> Okay. You're gonna need to get your runs into a .csv file for this. You can request a copy of your data from Strava, and they'll give you a .zip folder including a file named "activites.csv". This is the one you want.

      <div className='FileDrop'>
        <div className="ProgressBar">
          <div className={fileUploaded ? "done" : ""}>
          </div>
        </div>
        <FileDrop
            onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
            onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
            onFrameDrop={(event) => console.log('onFrameDrop', event)}
            onDragOver={(event) => console.log('onDragOver', event)}
            onDragLeave={(event) => console.log('onDragLeave', event)}
            onDrop={(files, event) => handleFileDrop(files,event)}
            onTargetClick={onTargetClick}
          >

            {fileDropMessage}
          </FileDrop>
          <input
            style={{display: 'none'}}
            onChange={onFileInputChange}
            ref={fileInputRef}
            type="file"
            className="hidden"
          />
        </div>

      {importData.length > 0 && <span>
        Out of {importData.length} activities in the file, <strong>{importRuns.length}</strong> of them are runs.

          {importRuns.length > 0 && <span>

            <br /><br />
            They stretch from <strong>{dateFormatter.tradCondensed(importRuns[0]['Activity Date'])}</strong> to <strong>{dateFormatter.tradCondensed(importRuns[importRuns.length-1]['Activity Date'])}</strong>: covering <strong>{importStats.distance.toFixed(0)}</strong> miles and going through <strong>{importStats.shoes.length}</strong> pairs of shoes.

            <br /> <br/>
            <div><span className="FakeA">Import them?</span></div>
          </span>}


      </span>}





    </div>
  )
// } else {
//   return(<div>No form.</div>)
// }
}

// <CSVReader1 importData={importData} setImportData={setImportData}/>


export default ImportForm
