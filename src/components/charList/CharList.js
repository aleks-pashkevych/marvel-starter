import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import useMarvelService from "../../services/MarvelService";
import { baseOffset } from "../../resources/CONSTANTS";

import "./charList.scss";

const CharList = (props) => {
  const [charList, setCharlist] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(baseOffset);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset).then(onCharListLoaded);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    setCharlist((charList) => [...charList, ...newCharList]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };
  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif"
      ) {
        imgStyle = { objectFit: "contain" };
      }
      return (
        <li
          className="char__item"
          tabIndex={0}
          ref={(element) => (itemRefs.current[i] = element)}
          key={item.id}
          onClick={() => {
            focusOnItem(i);
            props.onCharSelected(item.id);
            console.log("clicked");
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    // А эта конструкция вынесена для центровки карусели/ошибки
    return <ul className="char__grid">{items}</ul>;
  }

  const items = renderItems(charList);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && newItemLoading ? <Spinner /> : null;
  // const content = !(loading || error) ? items : null;

  let toShow = !charEnded ? "block" : "null";

  if (charEnded) {
    toShow = "none";
  }
  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {/* {content} */}
      {items}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: { toShow } }}
        onClick={() => {
          onRequest(offset);
        }}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
};

export default CharList;
