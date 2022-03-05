export interface IGrafikoni {
  id?: number;
  region?: string | null;
  promet?: number | null;
}

export class Grafikoni implements IGrafikoni {
  constructor(public id?: number, public region?: string | null, public promet?: number | null) {}
}

export function getGrafikoniIdentifier(grafikoni: IGrafikoni): number | undefined {
  return grafikoni.id;
}
