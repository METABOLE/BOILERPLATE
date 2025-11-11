import Hero from "@/features/shared/hero";
import { useSanityData } from "@/hooks/useSanityData";
import { fetchSamples } from "@/services/sample.service";
import type { InferGetStaticPropsType } from "next";

export const getStaticProps = async (context: { draftMode?: boolean }) => {
  const samples = await fetchSamples(context);
  
  return { 
    props: { 
      samples,
      draftMode: samples.draftMode
    } 
  };
}

export default function Page({ samples }: InferGetStaticPropsType<typeof getStaticProps>) {
  const samplesData = useSanityData(samples);

  return (
    <>
      <Hero 
        data={samplesData.data}
        encodeDataAttribute={samplesData.encodeDataAttribute}
      />
    </>
  );
}
