/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      colors: {
        bgPrimary: "#041508",
        btnPrimary: "#5F7A69",
        bodyColorligth: "#cfcfcf",
        lightText: "#c4cfde",
        darkText: "#2d302f",
        boxBg: "linear-gradient(145deg, #1e2024, #23272b)",
        // to top
        designColor: "#041508",
        vridro: "#030C04",
        tituloForm: "#083807",
        textoForm: "#23491D",
        fundoForm: "#A5B793",
        bgFild: "#064e3b",
        colorFron: "#117843",
        colotTo: "#264b41",
        footerBar: "#76897d",
      },
      boxShadow: {
        shadowOne: "2px 2px 40px #0b3d0b, -2px -2px 40px #064e3b",
        origamid: "0 4px 16px 4px rgba(0,0,0,.3)",
        sobre: "0 4px 40px 12px rgba(255,255,255,.3)",
        tesouros: "0 4px 50px 16px rgba(255,255,255,.3)",
        eventos: "0 4px 30px 10px rgba(255,255,255,.3)",
      },
      backgroundImage: {
        produtos: "url('/assets/background/produtos.png')",
        cadastro: "url('/assets/background/team.jpg')",
      },
    },
    container: {
      padding: {
        center: true,
        DEFAULT: "2rem",
        sm: "3rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      backgroundImage: {
        "header-main": "url('./src/assets/background/image.png')",
      },
    },
  },
  plugins: [],
};
