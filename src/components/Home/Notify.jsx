import React from "react";

const Notify = () => {
  return (
    <section className="notify">
      <div className="notify-text">
        <h2>Get notified when we update!</h2>
        <p>
          Get notified when we add new items to our special menu, update our
          price list to have promos !
        </p>
      </div>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="gregphillips@gmail.com" />
        <button type="submit">Get notified</button>
      </form>
    </section>
  );
};

export default Notify;
