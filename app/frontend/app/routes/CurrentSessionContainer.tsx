import React from 'react';
import { RecordPanelHost, useRecordPanel } from 'recordpanel';
import RecordingComponent from '../components/RecordingComponent';
import VideoRecorder from '../components/VideoRecorder';
import ScreenshotTool from '../components/ScreenshotTool.jsx';

const CurrentSessionContainer: React.FC = () => {
    
    return (
        <div>
            <ScreenshotTool />
            <VideoRecorder />
        </div>
        
    );
}

export default CurrentSessionContainer;