import {
  Bars2Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import useEmblaCarousel from "embla-carousel-react";
import { range } from "es-toolkit";
import { useEffect, useRef, useState } from "react";

import { useObserver } from "../hook/useObserver";
import { useFlow } from "../stack/app";

const imageSources = range(1, 9).map((index) => `/resource/home/${index}.jpg`);

export const Home: ActivityComponentType = () => {
  const { push } = useFlow();

  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);

  const [emblaRef, api] = useEmblaCarousel({ axis: "y" });
  const { ref } = useObserver<HTMLDivElement>(() => {
    api?.scrollTo(selectedRef.current, true);
  }, [api]);

  useEffect(() => {
    if (api) {
      api.on("select", (e) => {
        setSelected(e.selectedScrollSnap());
        selectedRef.current = e.selectedScrollSnap();
      });
      return () => {
        api.destroy();
      };
    }
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
          <span className="mt-1 inline-block font-serif text-8xl font-light leading-none tracking-tighter">
            SxSS
          </span>
          <p className="ml-1 mt-1 text-xs font-light">STACKFLOW XSTATE SHOP</p>
        </div>
        <div className="mt-4 flex flex-1 justify-end gap-4">
          <button
            onClick={() => {
              push("Search", {});
            }}
          >
            <MagnifyingGlassIcon className="size-6" />
          </button>
          <button
            onClick={() => {
              push("Basket", {});
            }}
          >
            <ShoppingBagIcon className="size-6" />
          </button>
        </div>
      </div>
      <div ref={ref}>
        <div className="embla fixed inset-0 overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex h-full flex-col">
            {imageSources.map((src, index) => (
              <button
                className="embla__slide min-h-0 shrink-0 grow-0 basis-[100vh]"
                key={src}
                onClick={() => push("ItemList", { itemId: index })}
              >
                <img
                  alt="cover"
                  className={`size-full object-cover duration-300 ${index < selected ? "scale-75" : "scale-100"}`}
                  src={src}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppScreen>
  );
};
