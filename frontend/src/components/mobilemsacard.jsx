import logo from '../assets/msapng.png'

export default function Mobilemsacard() {
  return (
    <div className="flex flex-col items-center text-center px-4 sm:px-6 md:px-8">

      <img
        src={logo} 
        alt="MSA Logo"
        className="
          w-32 sm:w-40 md:w-56 lg:w-64
          h-auto
          mb-4 sm:mb-6
          transition-all duration-300
        "
      />


      <h1
        className="
          text-xl sm:text-2xl md:text-3xl lg:text-4xl
          font-bold text-[#0b243b]
          leading-snug sm:leading-normal
          break-words
        "
      >
        The Muslim Student Association
      </h1>

      <p
        className="
          text-sm sm:text-base md:text-lg
          text-gray-700 mt-2 sm:mt-3
          max-w-xs sm:max-w-md md:max-w-xl
        "
      >
        Your new family away from home
      </p>
    </div>
  );
}
