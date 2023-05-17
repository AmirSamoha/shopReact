import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import axios from "axios";
import { getError } from "../utilsFront";
import { ToastContainer, toast } from "react-toastify";
import { Button, Card, Container, Form, ListGroup } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};

const ProductEditScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const initialState = { loading: true, error: "" };

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, initialState);

  //נקבל את כל הפרמטרים של פרטי המוצר
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [gander, setGander] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        //נבצע בקשה לשרת ונקבל את המוצר לפי המזהה שלו ונשמור את הנתונים בדאטא
        const { data } = await axios.get(`/api/products/product/${productId}`);

        // ונגדיר לכל פרמטר את השדה שלו מהמידע שחוזר מהדאטא כדי שנוכל ישירות להראות לאדמין את הנתונים בתרוך השדות אינפוט בצד לקוח
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setGander(data.gander);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      //נגדיר מוצר על פי המזהה שלו ובעזרת פוט נוכל לעדכן את המוצר
      await axios.put(
        `/api/products/product/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          gander,
          brand,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const uploadFileHandler = async (e, forImages) => { //e (אובייקט אירוע) ו-forImages (מדד בוליאני המציין אם ההעלאה מיועדת לתמונות)
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    console.log(bodyFormData)
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success("Image uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. click Update to apply it");
  };

  return (
    <Container className="large-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <h1>Edit Product {name}</h1>
      <ToastContainer position="top-left" limit={1} />

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3 form-group" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={`${price}$`}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 form-group" controlId="imageFile">
            <Form.Label>Change Main Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="additionalImage">
            <Form.Label>All Product Images</Form.Label>
            {images.length === 0 && image.length === 0 && (
              <MessageBox>No Images</MessageBox>
            )}
            <Card>
              <ListGroup variant="flush">
                {
                  <ListGroup.Item key={image}>
                    Main Photo:
                    <br></br>
                    <img src={image} alt={image} width="200" />
                  </ListGroup.Item>
                }
                {images.map((x) => (
                  <ListGroup.Item key={x}>
                    <Button
                      variant="light"
                      id="deleteImage"
                      onClick={() => deleteFileHandler(x)}
                    >
                      <i className="fa fa-times-circle"></i>
                    </Button>
                    &nbsp;
                    {x.slice(62)}
                    <br></br>
                    <img src={x} alt={x} width="200" />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Form.Group>
          <Form.Group
            className="mb-3 form-group"
            controlId="additionalImageFile"
          >
            <Form.Label>Upload More Images</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3 form-group" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option>Select Category</option>
              <option value="Pants">Pants</option>
              <option value="Shirts">Shirts</option>
              <option value="Shoes">Shoes</option>
              <option value="Baby">Baby</option>
              <option value="Video-Games">Video Games</option>
              <option value="Audio">Audio</option>
              <option value="Home-And-Kitchen">Home And Kitchen</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="gander">
            <Form.Label>Gander</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={gander}
              onChange={(e) => setGander(e.target.value)}
              required
            >
              <option>Select Gander</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3 form-group">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
};

export default ProductEditScreen;
