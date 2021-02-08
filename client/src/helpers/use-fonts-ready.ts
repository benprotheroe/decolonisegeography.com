import { useEffect, useState } from "react";

type CSSOMString = string;
type FontFaceLoadStatus = "unloaded" | "loading" | "loaded" | "error";
type FontFaceSetStatus = "loading" | "loaded";

interface FontFace {
  family: CSSOMString;
  style: CSSOMString;
  weight: CSSOMString;
  stretch: CSSOMString;
  unicodeRange: CSSOMString;
  variant: CSSOMString;
  featureSettings: CSSOMString;
  variationSettings: CSSOMString;
  display: CSSOMString;
  readonly status: FontFaceLoadStatus;
  readonly loaded: Promise<FontFace>;
  load(): Promise<FontFace>;
}

interface FontFaceSet {
  readonly status: FontFaceSetStatus;
  readonly ready: Promise<FontFaceSet>;
  check(font: string, text?: string): Boolean;
  load(font: string, text?: string): Promise<FontFace[]>;
}

interface DocumentWithFonts extends Document {
  fonts: FontFaceSet;
}

const useFontsReady = () => {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    if (!("fonts" in document)) {
      setFontsReady(true);
    }
  }, []);

  (document as DocumentWithFonts).fonts.ready.then(() => setFontsReady(true));

  return fontsReady;
};

export default useFontsReady;