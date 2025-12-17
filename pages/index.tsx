import Hero from '@/features/shared/hero';
import { useGyroscope } from '@/hooks/useGyroscope';
import { useSanityData } from '@/hooks/useSanityData';
import { useTouchDevice } from '@/hooks/useTouchDevice';
import { fetchSamples } from '@/services/sample.service';
import type { InferGetStaticPropsType } from 'next';

export const getStaticProps = async (context: { draftMode?: boolean }) => {
  const samples = await fetchSamples(context);

  return {
    props: {
      samples,
      draftMode: samples.draftMode,
    },
  };
};

export default function Page({ samples }: InferGetStaticPropsType<typeof getStaticProps>) {
  const samplesData = useSanityData(samples);
  const { x, y, isActive } = useGyroscope();
  const isTouch = useTouchDevice();

  return (
    <>
      {isTouch ? <p>Touch device 📱</p> : <p>Non-touch device 💻</p>}

      {isActive && (
        <>
          <div>
            <p>beta: {x}</p>
            <p>gamma: {y}</p>
          </div>
          <div className="relative mx-auto my-5 h-[300px] w-[300px] border-2 border-gray-800 bg-gray-100">
            <div
              className="absolute top-1/2 left-1/2 h-5 w-5 rounded-full bg-red-500"
              style={{
                transform: `translate(calc(-50% + ${y ?? 0}px), calc(-50% + ${x ?? 0}px))`,
              }}
            />
          </div>
        </>
      )}

      <Hero data={samplesData.data} encodeDataAttribute={samplesData.encodeDataAttribute} />
    </>
  );
}
