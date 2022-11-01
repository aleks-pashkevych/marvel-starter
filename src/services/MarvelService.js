import { API_BASE, TOKEN } from "../resources/CONSTANTS";
import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const getAllComics = async (offset = 10) => {
    const res = await request(
      `${API_BASE}comics?format=comic&formatType=comic&offset=${offset}&apikey=${TOKEN}`
    );
    return res;
  };

  const getCurrentComic = async (id = 1) => {
    const res = await request(`${API_BASE}comics/${id}?apikey=${TOKEN}`);
    return transformComic(res);
  };
  const getAllCharacters = async (offset = 210) => {
    const res = await request(
      `${API_BASE}characters?limit=9&offset=${offset}&apikey=${TOKEN}`
    );
    return res.data.results.map(transformCharacter);
  };
  const getCharacter = async (id) => {
    const res = await request(`${API_BASE}characters/${id}?apikey=${TOKEN}`);
    return transformCharacter(res.data.results[0]);
  };

  const transformComic = (comic) => {
    if (comic.description === "") {
      comic.description = "Sorry, no data available";
    }
  };
  const transformCharacter = (char) => {
    if (char.description === "") {
      char.description = "Sorry, no data available.";
    }
    if (char.description.length > 150) {
      char.description = char.description.slice(0, 150) + "...";
    }
    const picture = char.thumbnail.path + "." + char.thumbnail.extension;
    if (
      picture ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
    ) {
    }
    return {
      id: char.id,
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    };
  };
  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getCurrentComic,
    clearError
  };
};

export default useMarvelService;
