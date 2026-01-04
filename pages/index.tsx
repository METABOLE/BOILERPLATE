import Hero from '@/features/shared/hero';
import { useGyroscope } from '@/hooks/useGyroscope';
import { useSanityData } from '@/hooks/useSanityData';
import { useTouchDevice } from '@/hooks/useTouchDevice';
import { fetchSamples } from '@/services/sample.service';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { InferGetStaticPropsType } from 'next';
import { useRef } from 'react';

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

  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(dotRef.current, {
      x: x * 150,
      y: y * 150,
      duration: 0.1,
      ease: 'power2.out',
    });
  }, [x, y]);

  return (
    <>
      {isTouch ? <p>Touch device 📱</p> : <p>Non-touch device 💻</p>}

      {isActive && (
        <>
          <div>
            <p>gamma (horizontal): {x?.toFixed(2)}</p>
            <p>beta (vertical): {y?.toFixed(2)}</p>
          </div>
          <div className="relative mx-auto my-5 h-[300px] w-[300px] border-2 border-gray-800 bg-gray-100">
            <div
              ref={dotRef}
              className="absolute top-1/2 left-1/2 h-5 w-5 rounded-full bg-red-500"
              style={{
                marginLeft: '-10px',
                marginTop: '-10px',
              }}
            />
          </div>
        </>
      )}

      {/* <Hero data={samplesData.data} encodeDataAttribute={samplesData.encodeDataAttribute} /> */}
    </>
  );
}
