let userId = "1234";
const userFixture = () => {
  return {
    username: "user1",
    email: "email@email.com",
    password: "default",
    id: userId,
    recipes: [
      {
        id: "a2b3c4e10000000000000000",
        name: "waffles",
        description: "desc",
        user: userId,
      },
      { id: "a1b3c4e20000000000000000", name: "spaghetti", user: userId },
      { id: "a4b6c2310000000000000000", name: "pizza", user: userId },
    ],
  };
};

export default userFixture;
