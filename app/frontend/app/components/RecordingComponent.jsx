
import { useState } from 'react'
import { RecordPanelHost, useRecordPanel } from 'recordpanel'
import 'recordpanel/styles'

function RecordingComponent() {
  const [recording, setRecording] = useState(null)
  const recorder = useRecordPanel()

  const handleCapture = async () => {
    try {
      const result = await recorder.capture({
        cameraEnabled: true,
        audioEnabled: true
      })
      
      setRecording(result)
      
      // Download the recording
      const a = document.createElement('a')
      a.href = result.url
      a.download = `recording-${Date.now()}.webm`
      a.click()
      
      // Clean up
      URL.revokeObjectURL(result.url)
    } catch (error) {
      console.error('Recording failed:', error)
    }
  }

  return (
    <div>
      <button onClick={handleCapture}>Record Screen</button>
      {recording && (
        <video src={recording.url} controls />
      )}
    </div>
  )
}

export default RecordingComponent;
