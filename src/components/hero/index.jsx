import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import Banner1 from '../../../public/imgs/banner 1.png'
import Banner2 from '../../../public/imgs/banner 2.png'
import Banner3 from '../../../public/imgs/banner 3.png'
import BannerMobile1 from '../../../public/imgs/bannermobile1.png'
import BannerMobile2 from '../../../public/imgs/bannermobile2.png'
import BannerMobile3 from '../../../public/imgs/bannermobile3.png'
const Hero = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, []);


  return (
    <>
    <section className="md:pt-[136px] pt-[73px] md:block hidden relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <Swiper
        modules={[Pagination, Autoplay, Navigation, EffectFade]}
        onSwiper={setSwiperInstance}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800}
        pagination={{
          clickable: true,
        }}
        className="h-full"
      >
          <SwiperSlide>
            <img className='object-cover h-full w-full object-center' src={Banner1} alt="banner 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img className='object-cover h-full w-full object-center' src={Banner2} alt="banner 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img className='object-cover h-full w-full object-center' src={Banner3} alt="banner 3" />
          </SwiperSlide>
      </Swiper>

    </section>

    <section className="md:pt-[136px] pt-[73px] md:hidden block relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <Swiper
        modules={[Pagination, Autoplay, Navigation, EffectFade]}
        onSwiper={setSwiperInstance}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800}
        pagination={{
          clickable: true,
        }}
        className="h-full"
      >
          <SwiperSlide>
            <img className='object-cover h-full w-full object-center' src={BannerMobile1} alt="BannerMobile1" />
          </SwiperSlide>
          <SwiperSlide>
            <img className='object-cover h-full w-full object-center' src={BannerMobile2} alt="BannerMobile2" />
          </SwiperSlide>
          <SwiperSlide>
            <img className='object-cover h-full w-full object-center' src={BannerMobile3} alt="BannerMobile3" />
          </SwiperSlide>
      </Swiper>

    </section>
    </>
  );
};

export default Hero;
