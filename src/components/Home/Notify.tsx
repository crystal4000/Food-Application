const Notify = () => {
  return (
    <section className="mt-16 sm:mt-20 lg:mt-24 px-6 sm:px-10 lg:px-20">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-lg p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-custom-orange/10 rounded-full blur-2xl"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl text-custom-orange font-bold">
              Get notified when we update!
            </h2>
            <p className="text-white/90 text-base sm:text-md font-normal mt-6 sm:mt-8">
              Get notified when we add new items to our special menu, update our
              price list to have promos!
            </p>
          </div>

          <div className="flex justify-center lg:justify-end items-center mt-8 lg:mt-0">
            <form
              className="w-full flex flex-col sm:flex-row justify-center lg:justify-end items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="gregphillips@gmail.com"
                className="w-full sm:w-3/5 py-3 sm:py-4 rounded-md backdrop-blur-md bg-white/20 text-white border border-white/30 shadow-lg text-base sm:text-md pl-4 sm:pl-6 mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-custom-orange/50 transition-all duration-300 placeholder:text-white/70"
              />

              <button
                type="submit"
                className="w-full sm:w-auto py-3 sm:py-4 px-6 sm:px-8 rounded-md text-lg sm:text-xl sm:ml-4 text-emerald-900 bg-gradient-to-r from-custom-orange to-amber-500 hover:from-custom-orange-hover hover:to-amber-600 cursor-pointer font-semibold shadow-lg border border-white/20 transition-all duration-300 whitespace-nowrap"
              >
                Get notified
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notify;
