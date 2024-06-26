// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";
import { moduleId } from "./constants";
import { initTweaks, readyTweaks } from './tweaks/tweaks';

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);
  initTweaks();

});

Hooks.once("ready", () => {
  readyTweaks();
})
