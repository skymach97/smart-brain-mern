import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes, apiAge }) => {
	return (
		<div className="center ma pa2">
			<div style={{ position: 'relative' }}>
				<img id="inputimage" src={imageUrl} alt="" width="500px" height="auto" />
				{boxes.map((box, i) => {
					return (
						<div
							key={i}
							id="face"
							className="bounding-box"
							style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default FaceRecognition;
