import akasa from "@/assets/clients/akasa.webp";
import ashishBarjatya from "@/assets/clients/ashish-barjatya.webp";
import dreamnest from "@/assets/clients/dreamnest.webp";
import godrejProperties from "@/assets/clients/godrej-properties.webp";
import greenspire from "@/assets/clients/greenspire.webp";
import homeCorner from "@/assets/clients/home-corner.webp";
import idealGroup from "@/assets/clients/ideal-group.webp";
import inShape from "@/assets/clients/in-shape.webp";
import iris from "@/assets/clients/iris.webp";
import maxRealty from "@/assets/clients/max-realty.webp";
import microMitti from "@/assets/clients/micro-mitti.webp";
import omaxeHills from "@/assets/clients/omaxe-hills.webp";
import omaxe from "@/assets/clients/omaxe.webp";
import pitara from "@/assets/clients/pitara.webp";
import r21Realty from "@/assets/clients/r21-realty.webp";
import redwoodBiotech from "@/assets/clients/redwood-biotech.webp";
import shrikrishnaDevcon from "@/assets/clients/shrikrishna-devcon.webp";
import srEnterprises from "@/assets/clients/sr-enterprises.webp";
import theFocusutra from "@/assets/clients/the-focusutra.webp";
import tridentAssets from "@/assets/clients/trident-assets.webp";
import tulsiTraders from "@/assets/clients/tulsi-traders.webp";
import verdaniaEstate from "@/assets/clients/verdania-estate.webp";
import vertexRealEstate from "@/assets/clients/vertex-real-estate.webp";
import vimalshree from "@/assets/clients/vimalshree.webp";

export type ClientLogo = {
  name: string;
  src: string;
  /** Light artwork that needs a dark chip to stay readable. */
  dark?: boolean;
};

// Ordered so neighbouring chips alternate wide wordmarks and square badges.
export const clientLogos: ClientLogo[] = [
  { name: "Godrej Properties", src: godrejProperties },
  { name: "Akasa Real Estate", src: akasa },
  { name: "Omaxe", src: omaxe },
  { name: "Ashish Barjatya Associates", src: ashishBarjatya },
  { name: "Max Realty", src: maxRealty },
  { name: "Iris Premium Landmark", src: iris },
  { name: "Greenspire", src: greenspire },
  { name: "Tulsi Traders", src: tulsiTraders },
  { name: "Omaxe Hills", src: omaxeHills },
  { name: "Ideal Group", src: idealGroup },
  { name: "SR Enterprises", src: srEnterprises },
  { name: "Trident Assets", src: tridentAssets },
  { name: "Verdania Estate", src: verdaniaEstate },
  { name: "Vertex Real Estate", src: vertexRealEstate },
  { name: "The Focusutra", src: theFocusutra },
  { name: "Redwood Biotech", src: redwoodBiotech },
  { name: "Micro Mitti", src: microMitti },
  { name: "Shrikrishna Devcon", src: shrikrishnaDevcon },
  { name: "In Shape", src: inShape },
  { name: "Dreamnest Properties", src: dreamnest },
  { name: "Home Corner", src: homeCorner },
  { name: "R21 Realty Clinic", src: r21Realty },
  { name: "Pitara", src: pitara, dark: true },
  { name: "Vimalshree", src: vimalshree },
];
