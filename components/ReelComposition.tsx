import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export interface ReelCompositionProps {
  scenes: { text: string; durationInSeconds: number }[];
  bgColor: string;
  textColor: string;
}

export const ReelComposition = ({
  scenes,
  bgColor,
  textColor,
}: ReelCompositionProps) => {
  const { fps } = useVideoConfig();

  const scenesWithStartFrames = scenes.reduce((acc, scene, index) => {
    const durationInFrames = Math.round(scene.durationInSeconds * fps);
    const startFrame = index === 0 ? 0 : acc[index - 1].startFrame + acc[index - 1].durationInFrames;
    acc.push({ ...scene, durationInFrames, startFrame });
    return acc;
  }, [] as (typeof scenes[0] & { durationInFrames: number; startFrame: number })[]);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {scenesWithStartFrames.map((scene, index) => (
        <Sequence
          key={index}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <Scene text={scene.text} textColor={textColor} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Scene = ({ text, textColor }: { text: string; textColor: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
      }}
    >
      <h1
        style={{
          color: textColor,
          opacity,
          transform: `scale(${scale})`,
          fontSize: '100px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          textShadow: '0 4px 10px rgba(0,0,0,0.3)',
          lineHeight: 1.2,
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};
