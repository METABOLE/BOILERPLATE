import Button from '@/components/ui/button';
import Background from './shared/background';

const Hero = () => {
  return (
    <section className="relative flex h-screen w-screen flex-col items-center justify-center">
      <Background />
      <h1 className="z-10 text-center">
        Votre expertise <br /> mérite une voix.
      </h1>
      <div className="px-x-default absolute bottom-10 left-0 z-10">
        <p className="max-w-md">
          Tes idées, tes posts, tes visuels et ton planning sont préparés dans ta voix. Tu gardes le
          dernier mot avant chaque publication.
        </p>
        <div className="flex flex-wrap gap-2 pt-5">
          <Button color="accent">Réserver une démo</Button>
          <Button color="white">Souscrire à un abonnement</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
