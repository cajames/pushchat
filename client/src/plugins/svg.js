import Vue from "vue";
import SvgIcon from "vue-svgicon";
import "@/assets/svg.css"
import "@/assets/icons";

// Default tag name is 'svgicon'
Vue.use(SvgIcon, {
  tagName: "svgicon",
  isStroke: true
});