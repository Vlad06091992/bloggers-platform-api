import { AvailableResolutionsType } from "../../../types";

export type VideoCreateModel = {
  title: string;
  author: string;
  availableResolutions?: AvailableResolutionsType[] | null;
};
