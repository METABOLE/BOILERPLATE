import { urlFor } from "@/sanity/lib/image";
import { EncodeDataAttribute, Sample } from "@/types";
import Image from "next/image";

interface HeroProps {
  data: Sample[];
  encodeDataAttribute: EncodeDataAttribute;
}

const Hero = ({ data, encodeDataAttribute }: HeroProps) => {
  return (
    <div>
      {data.map((sample, index) => (
        <div key={sample._id}>
          <h1 data-sanity={encodeDataAttribute([index, 'name'])}>
            {sample.name}
          </h1>
          <Image
            alt={sample.name} 
            data-sanity={encodeDataAttribute([index, 'image'])} 
            height={100} 
            src={urlFor(sample.image).url()}
            width={100}
          />
        </div>
      ))}
    </div>
  );
};

export default Hero;
