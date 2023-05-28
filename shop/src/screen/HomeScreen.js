import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import  Products  from "../components/Products";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utilsFront";



const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST": //מצב שבו אנו שולחים את הבקשה לשרת נשמור על הערכים הישנים של סטייט ונגדיר את ההמתנה לאמת
      return { ...state, loading: true };
    case "FETCH_SUCCESS": // מצב שבו הבקשה נשלחה בהצלחה לשרת-נקבל שוב את הערכים הישנים של סטייט ונעדכן את המוצרים מהמידע שחוזר אקשיין.פיילוד מכיל את המוצרים מצד השרת
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL": // מצב שבו חזרה שגיאה מהבקשה לצד שרת
      console.log(action.payload);
      return { ...state, error: action.payload, loading: false };
    default: //מצב שבו לא מתרחש שום מקרה נחזיר את המצב הנוכחי
      return state;
  }
};

function HomeScreen() {
  //state
  // const [products, setProduct] = useState([]);

  //reducer
  const [{ products, loading, error }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });


  //effect
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({type: "FETCH_FAIL",payload: getError(err),});
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <main>
        <Helmet>
        <title>Store Products</title>
        </Helmet>
        <div className="products">
          <Row>
            {loading ? (
              <div>Loading... <LoadingBox /> </div>
            ) : error ? (
              <MessageBox variant="danger">{error} </MessageBox>
            ) : (
              products.map((product, index) => (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Products product={product} indexOfProduct={index} />
                </Col>
              ))
            )}
          </Row>
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;
