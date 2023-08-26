import React, { useEffect } from "react";

function Discovery(settings) {
  useEffect(() => {
    settings.changePage();
  }, []);

    return (
      <section id="profile-page">
        Discovery
      </section>
    );
  }

  export {Discovery};