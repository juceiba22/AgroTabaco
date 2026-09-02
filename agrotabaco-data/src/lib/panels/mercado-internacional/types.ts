export type TobaccoProduction = {
  entity: string;
  code: string | null;
  year: number;
  valueTonnes: number;
  entityType: "Country" | "Aggregate";
  entityDisplay: string;
};
