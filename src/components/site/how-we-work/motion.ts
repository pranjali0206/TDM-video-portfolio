import { createContext, useContext } from "react";

/** Whether the section is on screen, and whether the viewer prefers reduced motion. */
export const GrowthMotionContext = createContext({ onScreen: true, reduced: false });
export const useGrowthMotion = () => useContext(GrowthMotionContext);
