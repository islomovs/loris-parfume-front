import { create } from "zustand";

interface ICollection {
  id: number;
  slug: string;
  createdTime: string;
  nameUz: string;
  nameRu: string;
  nameEng: string | null;
  bannerImage: string | null;
  sortOrder: number;
  isFiftyPercentSaleApplied: boolean;
  isRecommendedInMainPage: boolean | null;
  categoriesList: ICategory[];
}

interface ICategory {
  categoryId: number;
  categoryNameUz: string;
  categoryNameRu: string;
  categoryNameEng: string | null;
  categoryIsRecommendedInMainPage: boolean | null;
}

interface CollectionState {
  collections: ICollection[];
  setCollections: (collections: ICollection[]) => void;
}

export const useCollectionStore = create<CollectionState>((set: any) => ({
  collections: [],
  setCollections: (collections) => set({ collections }),
}));
