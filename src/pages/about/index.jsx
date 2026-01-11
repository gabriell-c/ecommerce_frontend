import React from 'react';
import { Link } from 'react-router-dom';
import { TbTargetArrow } from "react-icons/tb";
import { IoDiamond } from "react-icons/io5";
import { RiRecycleFill } from "react-icons/ri";
import { FaLock, FaTruck, FaPhoneAlt, FaMobileAlt, FaHandHoldingHeart, FaEye } from "react-icons/fa";


const AboutPage = () => {
  return (
    <div className="md:pt-[136px] pt-[73px] min-h-screen bg-gray-50 text-gray-900">
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 text-white py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sobre a <span className="text-red-500">IPolar</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Revolucionando o e-commerce com tecnologia, inovação e uma experiência de compra única para nossos clientes.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Nossa História</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça a trajetória da IPolar desde sua fundação até se tornar uma referência no mercado.
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-600"></div>
            
            {[
              { year: "2018", title: "Fundação da IPolar", desc: "A IPolar nasceu com a missão de oferecer produtos de qualidade com uma experiência de compra diferenciada, focando inicialmente em eletrônicos e gadgets." },
              { year: "2020", title: "Expansão de Catálogo", desc: "Ampliamos nossa linha de produtos para incluir moda, casa e decoração, mantendo nosso padrão de qualidade e atendimento excepcional." },
              { year: "2022", title: "Tecnologia Proprietária", desc: "Desenvolvemos nossa própria plataforma de e-commerce com recursos avançados de personalização, recomendação e experiência do usuário." },
              { year: "2024", title: "Reconhecimento Nacional", desc: "Recebemos o prêmio de Melhor E-commerce do Ano, consolidando nossa posição como uma das principais plataformas do país." }
            ].map((item, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} mb-8 md:mb-0`}>
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-3">{item.title}</h3>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-2xl font-bold shadow-lg mx-auto md:mx-0">
                  {item.year}
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-50 to-purple-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Missão, Visão e Valores</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <TbTargetArrow/>,
                title: "Missão",
                content: "Oferecer uma experiência de compra excepcional, combinando produtos de qualidade, tecnologia inovadora e atendimento personalizado para superar as expectativas de nossos clientes.",
                color: "from-indigo-600 to-blue-500"
              },
              {
                icon: <FaEye/>,
                title: "Visão",
                content: "Ser a plataforma de e-commerce mais inovadora e confiável da América Latina, reconhecida pela excelência em experiência do cliente e pela transformação digital do varejo.",
                color: "from-red-500 to-orange-500"
              },
              {
                icon: <FaHandHoldingHeart/>,
                title: "Valores",
                content: (
                  <ul className="space-y-3 text-left list-none">
                    <li className="items-start"><span className="font-bold text-[var(--color4)] mr-2 br">Inovação:<br/></span> Buscamos sempre novas soluções e melhorias</li>
                    <li className="items-start"><span className="font-bold text-[var(--color4)] mr-2 br">Confiança:<br/></span> Transparência e segurança em todas as transações</li>
                    <li className="items-start"><span className="font-bold text-[var(--color4)] mr-2 br">Excelência:<br/></span> Qualidade em produtos, serviços e atendimento</li>
                    <li className="items-start"><span className="font-bold text-[var(--color4)] mr-2 br">Sustentabilidade:<br/></span> Preocupação com o impacto ambiental e social</li>
                  </ul>
                ),
                color: "from-purple-600 to-pink-600"
              }
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[var(--color3)] to-[var(--color5)]  text-white text-3xl mb-6`}>
                  
                  {card.icon}

                </div>
                <h3 className="text-2xl font-bold text-[var(--color1)] mb-4">{card.title}</h3>
                <div className="text-gray-700">{card.content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500.000+", label: "Clientes Satisfeitos" },
              { number: "15.000+", label: "Produtos no Catálogo" },
              { number: "98%", label: "Avaliações Positivas" },
              { number: "120+", label: "Cidades com Entrega" }
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-red-300">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">O que nos diferencia</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça os recursos e benefícios exclusivos que fazem da IPolar uma experiência única
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaTruck />, title: "Entrega Rápida", desc: "Entrega expressa em até 24h para grandes centros urbanos e logística eficiente para todo o país." },
              { icon: <FaLock />, title: "Segurança Garantida", desc: "Plataforma com criptografia de ponta a ponta e proteção de dados dos nossos clientes." },
              { icon: <FaPhoneAlt />, title: "Suporte 24/7", desc: "Atendimento humano disponível a qualquer hora do dia, todos os dias da semana." },
              { icon: <RiRecycleFill />, title: "Sustentabilidade", desc: "Embalagens ecológicas, logística otimizada e programas de reciclagem de produtos." },
              { icon: <FaMobileAlt />, title: "Experiência Mobile", desc: "Aplicativo nativo e site otimizado para proporcionar a melhor experiência em dispositivos móveis." },
              { icon: <IoDiamond />, title: "Programa de Fidelidade", desc: "Clube IPolar com benefícios exclusivos, descontos progressivos e recompensas personalizadas." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl flex justify-center flex-col items-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4 text-[var(--color4)]">{feature.icon}</div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-700 to-purple-800 text-white px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Faça parte da revolução IPolar</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Junte-se a mais de meio milhão de clientes que já descobriram uma nova forma de fazer compras online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/products"} className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
              Explorar Produtos
            </Link>
            <Link to={"/contact"} className="bg-transparent hover:bg-white/10 text-white font-bold py-4 px-8 rounded-lg text-lg border-2 border-white transition-colors duration-300">
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default AboutPage;