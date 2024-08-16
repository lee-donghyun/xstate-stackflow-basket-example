/* eslint-disable @typescript-eslint/unbound-method */
import {
  Bars2Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { useFlow } from "@stackflow/react/future";
import useEmblaCarousel from "embla-carousel-react";
import { range } from "es-toolkit";
import { useEffect, useState } from "react";

const imageSources = range(1, 9).map((index) => `/resource/home/${index}.jpg`);

export const Home: ActivityComponentType = () => {
  const { push } = useFlow();

  const [selected, setSelected] = useState(0);

  const [emblaRef, api] = useEmblaCarousel({ axis: "y" });

  useEffect(() => {
    api?.on("select", (e) => {
      setSelected(e.selectedScrollSnap());
    });
    return () => {
      api?.destroy();
    };
  }, [api]);

  return (
    <AppScreen>
      <div className="fixed inset-x-0 top-0 z-10 flex items-start gap-2 px-4">
        <button
          className="mt-4"
          onClick={() => {
            push("Menu", {});
          }}
        >
          <Bars2Icon className="size-6" />
        </button>
        <div>
          <span className="mt-1 inline-block text-8xl font-medium leading-none tracking-tighter">
            SxSS
          </span>
          <p className="ml-1 mt-1 text-sm font-light">Stackflow XState Shop</p>
        </div>
        <div className="mt-4 flex flex-1 justify-end gap-4">
          <button>
            <MagnifyingGlassIcon className="size-6" />
          </button>
          <button>
            <ShoppingBagIcon className="size-6" />
          </button>
        </div>
      </div>
      <div className="fixed inset-0">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex h-screen flex-col">
            {imageSources.map((src, index) => (
              <div
                className="embla__slide min-h-0 shrink-0 grow-0 basis-[100vh]"
                key={src}
              >
                <img
                  alt="cover"
                  className={`size-full object-cover duration-300 ${index < selected ? "scale-75" : "scale-100"}`}
                  src={src}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppScreen>
  );
};
