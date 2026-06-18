"use client"

import { Theme } from "@/types/experience"
import RainAtmosphere from "./RainAtmosphere"
import StarsAtmosphere from "./StarsAtmosphere"
import EmbersAtmosphere from "./EmbersAtmosphere"
import DustAtmosphere from "./DustAtmosphere"

type Props = {
  theme: Theme
}

export default function AtmosphereLayer({ theme }: Props) {
  switch (theme) {
    case "rainy-nostalgia":
      return <RainAtmosphere />
    case "midnight-thoughts":
      return <StarsAtmosphere />
    case "warm-memories":
      return <EmbersAtmosphere />
    case "sunset-drive":
      return <EmbersAtmosphere />
    case "cosmic":
      return <StarsAtmosphere />
    case "soft-healing":
      return <DustAtmosphere color="167, 243, 208" />
    default:
      return null
  }
}