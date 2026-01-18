import React, { useRef, useState } from 'react';
import { useScreenshot } from 'use-react-screenshot';

const ScreenshotTool = () => {
  const ref = useRef(null);
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(ref.current);
  
  const width = 400;
  return (
    <div>
      <div>
        <button style={{ marginBottom: '10px' }} onClick={getImage}>
          Take screenshot
        </button>
      </div>
      <img width={width} src={image} alt={'Screenshot'} />
      <div ref={ref}>
        <p>
        </p>
      </div>
    </div>
  )
};
export default ScreenshotTool;