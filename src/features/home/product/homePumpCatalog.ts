// Series types follow Sempa's product catalogue:
// https://sempapompa.com/tr/urunler/tumu
export const HOME_PUMPS = [
  {
    id: 1, name: "SCE Series", title: "Split Case Pumps",
    description: "Split-case centrifugal pump with a horizontally divided casing.",
    image: "/home/products/product.webp",
    modelUrl: "/home/products/models/sempa-sce.glb",
  },
  {
    id: 2, name: "ARS-UF Series", title: "Multi Stage Pumps",
    description: "End-suction multistage pump for applications requiring pressure across multiple stages.",
    image: "/home/products/1-k.jpg",
    modelUrl: "/3d/pumps/ARS-UF.glb",
  },
  {
    id: 3, name: "ASL 600H", title: "Axial Flow Pumps",
    description: "Axial-flow elbow propeller pump for high-volume fluid transfer.",
    image: "/home/products/asl.jpg",
    modelUrl: "/3d/pumps/ASL-600H.glb",
  },
  {
    id: 4, name: "DPT Series", title: "Wastewater Pumps",
    description: "Wastewater pump designed for sewage handling and fluid transfer.",
    image: "/home/products/dpt-di.jpg",
    modelUrl: "/3d/pumps/DPT.glb",
  },
  {
    id: 5, name: "SCE Series", title: "Split Case Pumps",
    description: "Split-case centrifugal pump with a divided casing for access to internal components.",
    image: "/home/products/product.webp",
    modelUrl: "/3d/pumps/SCE.glb",
  },
  {
    id: 6, name: "SVDP Series", title: "Vertical Turbine Pumps",
    description: "Vertical-shaft turbine pump for water intake and fluid transfer installations.",
    image: "/home/products/dpt-tr-100.jpg",
    modelUrl: "/3d/pumps/SVDP-2.glb",
  },
  {
    id: 7, name: "TKF Series", title: "End Suction Pumps",
    description: "Single-stage end-suction centrifugal pump for fluid transfer systems.",
    image: "/home/products/tkf-80.jpg",
    modelUrl: "/3d/pumps/TKF-2.glb",
  },
  {
    id: 8, name: "TKF-KE Series", title: "Self Priming Pumps",
    description: "Self-priming pump for applications requiring suction-line priming.",
    image: "/home/products/tkf-ke.jpg",
    modelUrl: "/3d/pumps/TKF-KE.glb",
  },
] as const;
