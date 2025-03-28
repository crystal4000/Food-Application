const Notify = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mt-16 sm:mt-20 lg:mt-24 px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-24 justify-center items-center">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-custom-orange-text font-bold">
          Get notified when we update!
        </h2>
        <p className="text-white-95 text-base sm:text-lg font-normal mt-6 sm:mt-10">
          Get notified when we add new items to our special menu, update our
          price list to have promos !
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
            className="w-full sm:w-3/5 py-3 sm:py-4 rounded-md shadow-lg text-base sm:text-lg pl-4 sm:pl-6 border-none mb-4 sm:mb-0"
          />
          <button
            type="submit"
            className="w-full sm:w-auto py-3 sm:py-4 px-6 sm:px-8 rounded-md text-lg sm:text-xl sm:ml-4 text-color-bg bg-custom-orange-text cursor-pointer font-semibold shadow-lg border-none whitespace-nowrap"
          >
            Get notified
          </button>
        </form>
      </div>
    </section>
  );
};

export default Notify;
