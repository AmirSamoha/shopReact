

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

export default reducer;
