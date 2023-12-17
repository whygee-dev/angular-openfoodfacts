export type Product = {
  id: string;
  image_url: string;
  product_name: string;
  ingredients_text: string;
  nutrition_grades: string;
  nutrient_levels: {
    fat: string;
    salt: string;
    ['saturated-fat']: string;
    sugars: string;
  };
};

export type HistoryItem = {
  id: string;
  timestamp: number;
};
