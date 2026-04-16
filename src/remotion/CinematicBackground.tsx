import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const CinematicBackground: React.FC = () => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	// Subtle geometric movement (Apple/BMW style)
	const opacity = interpolate(frame, [0, 30], [0, 0.4], {
		extrapolateRight: 'clamp',
	});

	const circle1X = interpolate(frame, [0, 150], [width * 0.2, width * 0.3]);
	const circle1Y = interpolate(frame, [0, 150], [height * 0.3, height * 0.2]);
	
	const circle2X = interpolate(frame, [0, 150], [width * 0.8, width * 0.7]);
	const circle2Y = interpolate(frame, [0, 150], [height * 0.7, height * 0.8]);

	return (
		<div style={{ flex: 1, backgroundColor: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
			{/* Luxury Gradient Glows */}
			<div
				style={{
					position: 'absolute',
					width: 800,
					height: 800,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
					left: circle1X - 400,
					top: circle1Y - 400,
					filter: 'blur(100px)',
					opacity,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 1000,
					height: 1000,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(26, 26, 26, 0.8) 0%, rgba(0,0,0,0) 70%)',
					right: circle2X - 500,
					bottom: circle2Y - 500,
					filter: 'blur(120px)',
					opacity,
				}}
			/>

			{/* Grid Lines (Modern Sophistication) */}
			<div 
				style={{ 
					position: 'absolute', 
					inset: 0, 
					backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
					backgroundSize: '100px 100px',
					opacity: 0.5
				}} 
			/>

			{/* Luxury Branding Shadow */}
			<div 
				style={{ 
					position: 'absolute', 
					bottom: 0, 
					left: 0, 
					right: 0, 
					height: '40%', 
					background: 'linear-gradient(to top, #0a0a0a, transparent)' 
				}} 
			/>
		</div>
	);
};
