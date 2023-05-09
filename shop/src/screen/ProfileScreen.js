import { ToastContainer, toast } from "react-toastify";
import { getError } from "../utilsFront";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import QRCode from "react-qr-code";
import { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";

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

const ProfileScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [randomCode, setRandomCode] = useState("");

  const [validEmail, setValidEmail] = useState(false);
  const [validCode, setValidCode] = useState(false);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const generateCode = (length) =>{
    const characters ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength)); //נוציא מספר רנדומלי בין 0 ל אורך התווים,נעגל את המספר,והמספר שיצא נמיר אותו למיקום האינדקס שלו במחרוזת ככה נוציא את התו הרנדולמלי
    }
    return result;
  }

  useEffect(() => {
    setRandomCode(generateCode(5));
  }, []);

  const sendCode = () => {
    if (email !== userInfo.email) {
      toast.error("Email is not valid");
      return;

    } else {
      setValidEmail(true);
      window.Email.send({ //פונקציה מוכנה של אלסטיק מייל שיחזור הסיסמא 
        Host: "smtp.elasticemail.com",
        Username: `${process.env.REACT_APP_MAIL_USERNAME}`,
        Password: `${process.env.REACT_APP_MAIL_PASSWORD}`,
        To: email,
        From: `${process.env.REACT_APP_MAIL_USERNAME}`,
        Subject: "Code For Password Reset",
        Body: `Your Code Is: ${randomCode}`,
      });
    }
  };

  const codeCheck = () => {
    //console.log(randomCode);
    if (code !== randomCode || code.length <= 0) { //פןנקציה שתבדוק אם הקוד שנשלח למייל לא תואם לרדום קוד או הקוד 0 אותיות לא יהיה תקין
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
        const { data } = await axios.put( // נשלח בקשה לנתיב זה 
          "/api/users/profile",
          { password }, //בגוף הבקשה נשלח את הסיסמא כדי שנוכל לעדכן אותה במסד נתונים
          { headers: { authorization: `Bearer ${userInfo.token}` } } //נשלח גם את הטוקן לאמת את המשתמש
        );

        dispatch({
          type: "UPDATE_SUCCESS",
        });
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Password Updated Successfully");

        setTimeout(() => {
          window.location.href = "/profile";
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
        <title>{userInfo.username} Profile</title>
      </Helmet>
      <ToastContainer position='top-center' limit={1}/>

      <h1 className="my-3">{userInfo.username}'s Profile</h1>
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
                placeholder={userInfo.email}
                autoComplete="off"
              />
            </Form.Group>
            <div className="mb-3">
              <Button
                type="button"
                onClick={sendCode}
                disabled={!email.length || email !== userInfo.email}
              >
                Send Code
              </Button>
            </div>
          </form>
          {validEmail && (
            <form>
              <Form.Group className="mb-3" controlId="code">
                <Form.Label>Check Email For Code / Scan The QR:</Form.Label>
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 364,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={randomCode}
                    viewBox={`0 0 256 256`}
                    fgColor="gray"
                    bgColor="#000"
                  />
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
            <form onSubmit={submitHandler}>
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
            </form>
          )}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default ProfileScreen;