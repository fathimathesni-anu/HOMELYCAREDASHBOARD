import jsonwebtoken from "jsonwebtoken";
export const genarateToken =(id,role) => {
  try {
    const token = jsonwebtoken.sign({ id:id,
      role:role || "user"},process.env.JWT_SECRET_KEY);
    return token;
  } catch (error) {
    console.log(error);
  }
};