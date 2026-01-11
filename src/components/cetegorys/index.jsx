import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { BiSolidWatchAlt, BiHome, BiSolidWebcam } from "react-icons/bi";
import { MdOutlineCable } from "react-icons/md";
import { IoFlash, IoHeadset } from "react-icons/io5";
import { FaFloppyDisk, FaLightbulb, FaComputerMouse, FaKeyboard, FaGamepad } from "react-icons/fa6";
import { BsFillHouseGearFill, BsGrid3X3GapFill } from "react-icons/bs";

import { BASE_URL } from '../../config';

const styles = `
  .embla { 
    position: relative; 
    width: 100%;
  }

  /* O Efeito de Fade nas beiradas */
  .embla__fade-overlay {
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
  }

  .embla__viewport { 
    overflow: visible; /* Mudança crucial para não cortar o tooltip */
    width: 100%; 
    cursor: grab;
    padding-top: 50px; /* Espaço extra para o tooltip não ser cortado */
    margin-top: -50px; /* Compensa o padding para manter o alinhamento */
  }

  /* Container interno que segura os slides e gerencia o clip */
  .embla__viewport-clip {
    overflow: hidden;
    width: 100%;
  }

  .embla__viewport:active { 
    cursor: grabbing; 
  }

  .embla__container { 
    display: flex; 
    touch-action: pan-y; 
    margin-left: -1rem; 
  }
  
  .embla__slide { 
    flex: 0 0 30%; 
    min-width: 0; 
    padding-left: 1rem; 
    display: flex; 
    justify-content: center;
  }

  @media (min-width: 640px) { .embla__slide { flex: 0 0 20%; } }
  @media (min-width: 1024px) { .embla__slide { flex: 0 0 12.5%; } }

  .embla__dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 2rem;
  }

  .embla__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #DEE2E6;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .embla__dot--selected {
    background-color: var(--color3);
    width: 18px;
    border-radius: 4px;
  }

  /* Tooltip logic */
  .category-card:hover .tooltip-box { 
    opacity: 1; 
    transform: translateX(-50%) translateY(-10px); 
  }

  .tooltip-box { 
    opacity: 0; 
    position: absolute; 
    top: -45px; /* Ajustado para ficar visível no novo padding */
    left: 50%; 
    transform: translateX(-50%) translateY(0); 
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    pointer-events: none;
    z-index: 50; /* Z-index alto para ficar sobre tudo */
  }
`;

const Category = () => {
    const [categoryApi, setCategoryAPI] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { 
            loop: true, 
            align: 'center', 
            containScroll: false
        }, 
        [Autoplay({ delay: 3500, stopOnInteraction: false })]
    );

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    const categoryIcons = {
        "smartwatches": BiSolidWatchAlt,
        "fones-de-ouvido-e-headsets": IoHeadset,
        "carregadores-e-cabos": MdOutlineCable ,
        "power-banks": IoFlash,
        "mouse": FaComputerMouse,
        "teclado": FaKeyboard,
        "gamer": FaGamepad,
        "iluminacao": FaLightbulb,
        "armazenamento": FaFloppyDisk,
        "casa-inteligente": BsFillHouseGearFill,
        "webcam": BiSolidWebcam,
    };

    useEffect(() => {
        fetch(`${BASE_URL}/api/category/`)
            .then(res => res.json())
            .then(data => setCategoryAPI(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <section className="py-16 bg-white overflow-hidden">
            <style>{styles}</style>
            <div className="max-w-7xl mx-auto px-4">
                
                <div className="inline-flex items-center gap-2 mb-4 justify-center w-full">
                    <BsGrid3X3GapFill className="text-[var(--color3)] text-xl" />
                    <span className="text-sm font-semibold text-[var(--color1)] uppercase tracking-wider">
                        Categorias
                    </span>
                </div>
                    
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-center">
                    Explore por{' '}
                    <span className="relative">
                        <span className="relative z-10 bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] bg-clip-text text-transparent">
                            Categoria
                        </span>
                        <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-100 to-purple-100 -z-10"></div>
                    </span>
                </h2>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed text-center">
                    Navegue por nossas categorias cuidadosamente selecionadas. 
                </p>

                <div className="relative">
                    <button
                        onClick={scrollPrev}
                        className="absolute -left-6 xl:-left-12 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#3626a7] hover:text-white transition-all hidden lg:flex"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={scrollNext}
                        className="absolute -right-6 xl:-right-12 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#3626a7] hover:text-white transition-all hidden lg:flex"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                    </button>

                    <div className="embla__fade-overlay">
                        <div className="embla__viewport-clip">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
                                    {categoryApi.map((category) => {
                                        const Icon = categoryIcons[category.slug] || BiHome;
                                        return (
                                            <div className="embla__slide" key={category.id}>
                                                <div className="category-card flex flex-col items-center relative py-4">
                                                    
                                                    <div className="tooltip-box px-4 py-1.5 rounded-lg text-white text-xs font-bold whitespace-nowrap shadow-md bg-[var(--color3)]">
                                                        {category.name}
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-[var(--color3)]" />
                                                    </div>

                                                    <a 
                                                        href={`/category/${category.slug}`}
                                                        className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
                                                    >
                                                        <div className="absolute inset-0 bg-[var(--color3)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                        <Icon className="icon-svg-content relative z-10 text-2xl md:text-3xl transition-colors duration-300 text-gray-600 group-hover:text-white"/>
                                                    </a>
                                                    
                                                    <span className="mt-3 text-[10px] font-bold text-gray-500 uppercase text-center md:hidden tracking-tight px-1">
                                                        {category.name.split(' ')[0]}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="embla__dots">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
                            />
                        ))}
                    </div>
                </div>
                
                <hr className='w-full border-1 mt-12 mb-15' style={{borderColor: "var(--color3)", opacity: 0.15}}/>
            </div>
        </section>
    );
};

export default Category;