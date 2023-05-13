import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import { toast, ToastContainer } from "react-toastify";
import { getError } from "../utilsFront";
import { Helmet } from "react-helmet-async";
import { Button, Form, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

const ResetpasswordScreen = () => {
  const { dispatch: ctxDispatch } = useContext(Store);
  //const { userInfo } = state;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [randomCode, setRandomCode] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validCode, setValidCode] = useState(false);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const generateCode = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength)); //נוציא מספר רנדומלי בין 0 ל אורך התווים,נעגל את המספר,והמספר שיצא נמיר אותו למיקום האינדקס שלו במחרוזת ככה נוציא את התו הרנדולמלי
    }
    return result;
  };

  useEffect(() => {
    setRandomCode(generateCode(5));
  }, []);

  // const sendCode = () => { //  לוודא שהמתתמש קיים במערכת לשלוח את המייל בפוסט

  //     setValidEmail(true);
  //     window.Email.send({
  //       //פונקציה מוכנה של אלסטיק מייל שיחזור הסיסמא
  //       Host: "smtp.elasticemail.com",
  //       Username: `${process.env.REACT_APP_MAIL_USERNAME}`,
  //       Password: `${process.env.REACT_APP_MAIL_PASSWORD}`,
  //       To: email,
  //       From: `${process.env.REACT_APP_MAIL_USERNAME}`,
  //       Subject: "Code For Password Reset",
  //       Body: `Your Code Is: ${randomCode}`,
  //     });
  //   // }
  // };

  //ניסוי
  const sendCode = async (e) => {
    //  לוודא שהמתתמש קיים במערכת לשלוח את המייל בפוסט
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/configmail", {email,}); // נעביר את הפרמטרים לבקשה לצד שרת
      console.log(data)
      setValidEmail(true);
      window.Email.send({
        //פונקציה מוכנה של אלסטיק מייל שיחזור הסיסמא
        Host: "smtp.elasticemail.com",
        Username: `${process.env.REACT_APP_MAIL_USERNAME}`,
        Password: `${process.env.REACT_APP_MAIL_PASSWORD}`,
        To: email,
        From: `${process.env.REACT_APP_MAIL_USERNAME}`,
        Subject: "Code For Password Reset",
        Body: `Your Code Is: ${randomCode}`,
      });
    } catch (err) {
      toast.error(getError(err));
    }

  };

  const codeCheck = () => {
    //console.log(randomCode);
    if (code !== randomCode || code.length <= 0) {
      //פןנקציה שתבדוק אם הקוד שנשלח למייל לא תואם לרדום קוד או הקוד 0 אותיות לא יהיה תקין
      toast.error("Code is not valid, Check email");
      return;
    } else {
      setValidCode(true); // אחרת בןצע בהצלחה
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    } else if (password.length < 6) {
      toast.error("Password should be 6 characters at least");
      return;
    } else {
      try {
        const { data } = await axios.put(
          // נשלח בקשה לנתיב זה
          "/api/users/reset-password",
          { password, email }, //בגוף הבקשה נשלח את הסיסמא כדי שנוכל לעדכן אותה במסד נתונים
        );

        dispatch({type: "UPDATE_SUCCESS",});
        ctxDispatch({ type: "USER_SIGNOUT", payload: data });
        //localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Password Updated Successfully"); 

        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
        });
        toast.error(getError(err));
      }
    }
  };
  
  return (
    <div className="container small-container">
      <Helmet>
        <title>reset password</title>
      </Helmet>

      <h1 className="my-3">reset password</h1>
      <ToastContainer position='top-center' limit={1}/>

      <ListGroup>
        <ListGroup.Item>
          <h6 className="my-3">Update Password:</h6>
        </ListGroup.Item>
        <ListGroup.Item>
          <form>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Enter Email:</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                autoComplete="off"
              />
            </Form.Group>
            <div className="mb-3">
              <Button
                type="button"
                onClick={sendCode}
              >
                Send Code
              </Button>
            </div>
          </form>
          {validEmail && (
            <form>
              <Form.Group className="mb-3" controlId="code">
                <Form.Label>Check Email For Code:</Form.Label>
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 364,
                    width: "100%",
                  }}
                >
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="code">
                <Form.Label>Enter Code:</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="off"
                  required
                />
              </Form.Group>
              <div className="mb-3">
                <Button
                  type="button"
                  onClick={codeCheck}
                  disabled={!code.length}
                >
                  Validate Code
                </Button>
              </div>
            </form>
          )}
          {validCode && (
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
              </Form.Group>
              <div className="mb-3">
                <Button
                  type="submit"
                  disabled={!password.length || !confirmPassword.length}
                >
                  Update
                </Button>
              </div>
            </Form>
          )}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default ResetpasswordScreen;
