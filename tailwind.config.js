/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Enabled Just-In-Time (JIT) mode for faster compilation - used so the server does not to be restarted everytime after running the script to style
  content: [
    './views/**/*.ejs' // Specify the paths to the EJS files used for generating the CSS - every tailwind class I add gets translated to css
  ],
  theme: {
    fontFamily: {
      kaushanScript: ['Kaushan Script', 'cursive'] // Define a custom font family from Google fonts - imported in the htmlHead ejs file
    },
    extend: {},
  },
  plugins: [],
}