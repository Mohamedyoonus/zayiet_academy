// Line-art pictures for the Fun Zone coloring book.
// Every picture uses a 400x300 viewBox. `regions` are closed shapes kids can
// tap to fill (later regions sit on top of earlier ones); `details` are
// outline-only strokes drawn above everything and never filled.

export type ColoringRegion = { id: string; d: string };

export type ColoringPage = {
  id: string;
  title: string;
  regions: ColoringRegion[];
  details: string[];
  /** Small solid-black bits such as pupils */
  ink?: string[];
};

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;

const SKY = "M0 0 H400 V300 H0 Z";

export const coloringPages: ColoringPage[] = [
  {
    id: "butterfly",
    title: "Butterfly",
    regions: [
      { id: "sky", d: SKY },
      { id: "wing-lt", d: "M196 150 C150 60 70 50 70 110 C70 150 130 160 196 150 Z" },
      { id: "wing-lb", d: "M196 158 C140 160 90 200 110 235 C130 265 180 220 196 170 Z" },
      { id: "wing-rt", d: "M204 150 C250 60 330 50 330 110 C330 150 270 160 204 150 Z" },
      { id: "wing-rb", d: "M204 158 C260 160 310 200 290 235 C270 265 220 220 204 170 Z" },
      { id: "spot-lt", d: circle(124, 108, 16) },
      { id: "spot-rt", d: circle(276, 108, 16) },
      { id: "spot-lb", d: circle(140, 214, 10) },
      { id: "spot-rb", d: circle(260, 214, 10) },
      { id: "body", d: "M200 120 C213 120 213 232 200 232 C187 232 187 120 200 120 Z" },
      { id: "head", d: circle(200, 110, 13) },
    ],
    details: ["M196 99 Q185 70 170 64", "M204 99 Q215 70 230 64", "M192 150 H208 M191 172 H209 M192 194 H208"],
    ink: [circle(170, 64, 4), circle(230, 64, 4)],
  },
  {
    id: "fish",
    title: "Happy Fish",
    regions: [
      { id: "water", d: SKY },
      { id: "sand", d: "M0 250 Q100 230 200 250 T400 250 V300 H0 Z" },
      { id: "weed-l", d: "M40 252 C28 220 56 200 40 168 C58 190 62 222 52 252 Z" },
      { id: "weed-r", d: "M350 252 C338 216 366 200 352 174 C370 196 374 226 362 252 Z" },
      { id: "tail", d: "M296 150 L360 104 Q344 150 360 196 Z" },
      { id: "fin-top", d: "M178 104 Q208 52 252 100 Z" },
      { id: "fin-bottom", d: "M200 196 Q214 236 246 200 Z" },
      { id: "body", d: "M110 150 C150 80 270 80 300 150 C270 220 150 220 110 150 Z" },
      { id: "eye", d: circle(150, 140, 11) },
      { id: "bubble-1", d: circle(84, 84, 11) },
      { id: "bubble-2", d: circle(64, 46, 7) },
      { id: "bubble-3", d: circle(98, 30, 5) },
    ],
    details: [
      "M116 160 Q126 166 132 157",
      "M178 122 Q166 150 178 178",
      "M212 128 q11 11 0 22 M236 124 q12 13 0 26 M260 130 q9 10 0 20",
    ],
    ink: [circle(152, 140, 4.5)],
  },
  {
    id: "house",
    title: "My House",
    regions: [
      { id: "sky", d: SKY },
      { id: "sun", d: circle(340, 60, 28) },
      { id: "cloud", d: "M40 74 q0 -20 22 -18 q10 -18 32 -6 q22 -4 22 16 q12 12 -6 22 H48 q-18 -2 -8 -14 Z" },
      { id: "grass", d: "M0 240 H400 V300 H0 Z" },
      { id: "chimney", d: "M234 88 H258 V140 H234 Z" },
      { id: "wall", d: "M110 150 H270 V250 H110 Z" },
      { id: "roof", d: "M94 156 L190 80 L286 156 Z" },
      { id: "door", d: "M170 250 V196 Q190 180 210 196 V250 Z" },
      { id: "window-l", d: "M124 170 H160 V206 H124 Z" },
      { id: "window-r", d: "M220 170 H256 V206 H220 Z" },
      { id: "trunk", d: "M330 250 V186 H346 V250 Z" },
      { id: "tree", d: circle(338, 160, 36) },
    ],
    details: [
      "M142 170 V206 M124 188 H160 M238 170 V206 M220 188 H256",
      "M340 14 v12 M340 94 v10 M296 60 h12 M372 60 h12 M309 29 l8 8 M363 83 l8 8 M309 91 l8 -8 M363 37 l8 -8",
      "M20 262 l6 -10 l6 10 M60 276 l6 -10 l6 10 M372 272 l6 -10 l6 10",
    ],
    ink: [circle(202, 224, 3)],
  },
  {
    id: "flower",
    title: "Flower Pot",
    regions: [
      { id: "wall", d: SKY },
      { id: "table", d: "M0 250 H400 V300 H0 Z" },
      { id: "stem", d: "M197 176 V100 H203 V176 Z" },
      { id: "leaf-l", d: "M200 152 Q164 148 156 118 Q190 120 200 152 Z" },
      { id: "leaf-r", d: "M200 142 Q236 138 244 108 Q210 110 200 142 Z" },
      { id: "petal-1", d: circle(228, 80, 22) },
      { id: "petal-2", d: circle(214, 104, 22) },
      { id: "petal-3", d: circle(186, 104, 22) },
      { id: "petal-4", d: circle(172, 80, 22) },
      { id: "petal-5", d: circle(186, 56, 22) },
      { id: "petal-6", d: circle(214, 56, 22) },
      { id: "center", d: circle(200, 80, 17) },
      { id: "pot", d: "M150 190 H250 L234 256 H166 Z" },
      { id: "rim", d: "M140 174 H260 V194 H140 Z" },
    ],
    details: ["M162 222 Q176 212 190 222 T218 222 T240 222"],
  },
];
