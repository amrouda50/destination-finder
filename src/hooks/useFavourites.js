import {create} from "zustand";
import {useToken} from "../components/AuthProvider/AuthProvider";
import {FavouritesApi} from "../api/favourites";


export const useFavourites = create((set, get) => ({
  favourites: [],
  fetcher: {},
  initialized: false,

  /**
   * Setup the fetcher and get favourites
   * @param{String} userId
   * @returns {Promise<void>}
   */
  async fetch(userId) {
    const token = useToken.getState().token;
    const fetcher = new FavouritesApi(
      `${process.env.REACT_APP_BACKEND_URL}/favourites/${userId}`,
      { Authorization: `bearer ${token}` },
    )
    const data = await fetcher.getFavourites();
    set({ favourites: data, fetcher, initialized: true });
  },

  async remove(country) {
    const items = get().favourites.filter(curr => curr.name !== country);
    const success = await get().fetcher.updateFavourite(items);
    if (success) {
      set({ favourites: items });
    }
  },
  /**
   *
   * @param{String} country
   * @param{Array[]} months
   * @returns {Promise<void>}
   */
  async add(country, months) {
    const item = { name: country, months: months?.join(',') };
    set((state) => ({ favourites: [...state.favourites, item ] }))
    const success = await get().fetcher.updateFavourite(get().favourites);
    if (!success) {
      set((state) => ({
        favourites: [...state.favourites.filter(i => i.country !== country) ]
      }))
    }
  }
}));