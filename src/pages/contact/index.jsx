import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhoneAlt, 
  faEnvelope, 
  faClock,
  faPaperPlane,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faGithub} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isSuccess = true; 
    
    if (isSuccess) {
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          error: false,
          message: ''
        });
      }, 5000);
    } else {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Erro ao enviar mensagem. Tente novamente.'
      });
    }
  };

  return (
    <div className="md:pt-[136px] pt-[73px] min-h-screen bg-gray-50 text-gray-900">
      <section className="relative bg-gradient-to-br from-[#3626a7] via-[#9820d4] to-[#3626a7] text-white py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fale Conosco
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Estamos aqui para ajudar! Entre em contato para dúvidas, suporte ou parcerias.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-bold text-[#3626a7] mb-6">Nossos Canais</h2>
                <p className="text-gray-600 mb-8">
                  Entre em contato através dos nossos canais preferenciais. Nossa equipe está pronta para atendê-lo.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color4)] mb-2">Endereço</h3>
                    <p className="text-gray-700">
                      Av. dos exemplos, 1234<br />
                      Ribeirão Preto - SP<br />
                      CEP: 01234-567
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faPhoneAlt} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color4)] mb-2">Telefone</h3>
                    <p className="text-gray-700">
                      (16) 99297 - 4306 (whatsapp)<br />
                      (11) 98765-4321
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color4)] mb-2">E-mail</h3>
                    <p className="text-gray-700">
                      suporte@ipolar.com.br<br />
                      vendas@ipolar.com.br<br />
                      gabri3lcardoso07@gmail.br
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faClock} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color4)] mb-2">Horário de Atendimento</h3>
                    <p className="text-gray-700">
                      Segunda a Sexta: 8h às 20h<br />
                      Sábado: 9h às 18h<br />
                      Domingo: 10h às 16h
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-[#3626a7] mb-6">Siga a IPolar</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: faLinkedinIn, color: 'bg-blue-600 hover:bg-blue-700', url: 'https://www.linkedin.com/in/gabriell-cardoso' },
                    { icon: faInstagram, color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90', url: 'https://www.instagram.com/gabri3l.cardoso' },
                    { icon: faGithub, color: 'bg-gray-800 hover:bg-gray-500', url: 'https://github.com/gabriell-c' },
                  ].map((social, index) => (
                    <Link
                      key={index}
                      to={social.url}
                      className={`w-12 h-12 rounded-full ${social.color} flex items-center justify-center text-white text-lg transition-all duration-300 transform hover:-translate-y-1`}
                      aria-label={`Siga-nos no ${social.icon.iconName}`}
                    >
                      <FontAwesomeIcon icon={social.icon} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#3626a7] mb-4">Envie sua Mensagem</h2>
                <p className="text-gray-600">
                  Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
                </p>
              </div>

              {formStatus.message && (
                <div className={`mb-6 p-4 rounded-lg ${formStatus.error ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={formStatus.error ? faExclamationTriangle : faCheckCircle} 
                      className={`mr-3 ${formStatus.error ? 'text-red-600' : 'text-green-600'}`}
                    />
                    <span>{formStatus.message}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3626a7] focus:border-transparent transition-all duration-300"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3626a7] focus:border-transparent transition-all duration-300"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3626a7] focus:border-transparent transition-all duration-300"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3626a7] focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="vendas">Dúvidas sobre Vendas</option>
                      <option value="parceria">Parcerias</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3626a7] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Descreva sua dúvida, solicitação ou proposta..."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="w-4 h-4 text-[#3626a7] bg-gray-100 border-gray-300 rounded focus:ring-[#3626a7]"
                  />
                  <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                    Concordo com a política de privacidade e tratamento de dados da IPolar.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus.submitted}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 ${formStatus.submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#ff331f] to-[#9820d4] hover:shadow-xl'} text-white flex items-center justify-center`}
                >
                  {formStatus.submitted ? (
                    'Enviando...'
                  ) : (
                    <>
                      Enviar Mensagem
                      <FontAwesomeIcon icon={faPaperPlane} className="ml-3" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  * Campos obrigatórios<br />
                  Resposta garantida em até 24 horas úteis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center text-[#3626a7] mb-10">Nossa Localização</h2>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl h-96 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-6 text-[#3626a7]">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">São Paulo - SP</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Estamos localizados no coração do polo tecnológico de São Paulo, 
                pronto para atender suas necessidades.
              </p>
              <Link to={"https://maps.app.goo.gl/4yBAbsZoLzGjsApGA"} className=" px-8 py-3 bg-gradient-to-r from-[#3626a7] to-[#9820d4] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Abrir no Google Maps
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16  from-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center text-[#3626a7] mb-12">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Qual o prazo para resposta?",
                answer: "Garantimos resposta em até 24 horas úteis para todos os canais de contato."
              },
              {
                question: "A IPolar tem loja física?",
                answer: "Somos um e-commerce 100% online, mas você pode retirar pedidos em nosso centro de distribuição com agendamento prévio."
              },
              {
                question: "Como funciona o suporte pós-venda?",
                answer: "Oferecemos suporte via chat, telefone e e-mail por 30 dias após a compra para produtos com garantia."
              },
              {
                question: "Quais formas de pagamento são aceitas?",
                answer: "Aceitamos cartões de crédito, débito, PIX, boleto bancário e parcelamento em até 12x."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-[#3626a7] mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;