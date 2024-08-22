declare module "*.svg" {
  import * as React from "react";
  
  // Export the React component for SVG
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  
  // Export the default string for the SVG source
  const src: string;
  export default src;
}
