import React, { useEffect, useReducer} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getError } from "../utilsFront";
import { Helmet } from "react-helmet-async";
import {Row, Col, Button} from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import Rating from "../components/Rating";
import MessageBox from "../components/MessageBox";
import Products from "../components/Products";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "from $10 to $50",
    value: "10-50",
  },
  {
    name: "from $50 to $500",
    value: "50-500",
  },
];

export const ratings = [
  {
    name: "4 Stars & Up",
    rating: 4,
  },

  {
    name: "3 Stars & Up",
    rating: 3,
  },

  {
    name: "2 Stars & Up",
    rating: 2,
  },

  {
    name: "1 Star & Up",
    rating: 1,
  },
];

const SearchScreen  = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  console.log(search);
  const sp = new URLSearchParams(search); // להפוך את מה שאחרי  הסרץ לפרמנט
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "lowest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        ); //פונים לנתיב עם שאילתות ונכניס לערך דאטא
        dispatch({ type: "FETCH_SUCCESS", payload: data }); //אם חזר תקין נשלח את הדאטא לרדוסר
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);



  const getFilterUrl = (filter) => { //כל פילטור שאני ילחץ ישפיע על הנתיב לפי הקטגוריה או הערך שלו
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={12}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? "No" : countProducts} Results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : Price " + price}
                    {rating !== "all" && " : Rating " + rating + " & up"}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{" "}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest" defaultValue >
                      Price: Low to High
                    </option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                  <br></br>
                  <br></br>
                  <div>
                    <h3>Price Range</h3>
                    <ul>
                      <ol>
                        <Link
                          className={"all" === price ? "text-bold link" : ""}
                          to={getFilterUrl({ price: "all" })}
                        >
                          All
                        </Link>
                      </ol>
                      {prices.map((p) => (
                        <ol key={p.value} className="link">
                          <Link
                            to={getFilterUrl({ price: p.value })}
                            className={p.value === price ? "text-bold" : ""}
                          >
                            {p.name}
                          </Link>
                        </ol>
                      ))}
                    </ul>
                  </div>
                  <div className="d-grid">
                    <h3>Sort By Customer Reviews</h3>
                    <ul>
                      {ratings.map((r) => (
                        <ol key={r.name}>
                          <Link
                            to={getFilterUrl({ rating: r.rating })}
                            className={
                              `${r.rating}` === `${rating}` ? "text-bold link" : ""
                            }
                          >
                            <Rating caption={" "} rating={r.rating}></Rating>
                          </Link>
                        </ol>
                      ))}
                      <ol>
                        <Link
                          to={getFilterUrl({ rating: "all" })}
                          className={rating === "all" ? "text-bold" : ""} 
                        >
                          <Rating caption={" "} rating={0}></Rating>
                        </Link>
                      </ol>
                    </ul>
                  </div>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row className="products-row">
                {products.map((product, index) => (
                  <Col sm={6} lg={3} className="mb-3" key={product._id}>
                    <Products product={product} indexOfProduct={index}></Products>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x) => ( //ניצור מערך של מספרים/דפים ונעשה להם מיפוי ונוסיף לכל מספר לינק שנוכל לעבור בין העמודים
                  <Link
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </Link>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SearchScreen;